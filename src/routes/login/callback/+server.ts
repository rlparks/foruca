import { env } from "$env/dynamic/private";
import { getCurrentFormattedDateTime, OIDC_STATE_KEY } from "$lib";
import { createSession, getAuthProviderInfo } from "$lib/server/auth";
import { setSessionCookie } from "$lib/server/auth/helpers";
import { queries } from "$lib/server/db/queries";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const { OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_USERNAME_CLAIM } = env;

export const GET: RequestHandler = async (event) => {
	const storedState = event.cookies.get(OIDC_STATE_KEY);
	event.cookies.delete(OIDC_STATE_KEY, { path: "/" });

	const code = event.url.searchParams.get("code");
	const urlState = event.url.searchParams.get("state");

	if (!storedState || !code || !urlState) {
		return error(400, "Invalid parameters!");
	}

	if (storedState !== urlState) {
		return error(400, "Invalid parameters!");
	}

	const { tokenEndpoint, userinfoEndpoint } = await getAuthProviderInfo();

	const { access_token, id_token } = await getAccessToken(
		tokenEndpoint,
		code,
		`${event.url.origin}/login/callback`,
	);

	const userInfo = await getUserInfo(userinfoEndpoint, access_token);
	const username = OIDC_USERNAME_CLAIM in userInfo ? userInfo[OIDC_USERNAME_CLAIM] : null;

	if (!username) {
		return error(400, "Missing username");
	}

	const ipAddress = event.getClientAddress();
	const userAgent = event.request.headers.get("user-agent") || "";

	const session = await loginAccount(username, id_token, ipAddress, userAgent);

	setSessionCookie(event.cookies, session.token, session.expiresAt);

	return redirect(303, "/");
};

async function getAccessToken(tokenEndpoint: string, code: string, redirectUri: string) {
	const body = new URLSearchParams();
	body.append("grant_type", "authorization_code");
	body.append("client_id", OIDC_CLIENT_ID);
	body.append("client_secret", OIDC_CLIENT_SECRET);
	body.append("redirect_uri", redirectUri);
	body.append("code", code);

	const result = await fetch(tokenEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body,
	});

	if (!result.ok) {
		return error(500, "Failure getting auth token");
	}

	const tokenJson = await result.json();

	if (!validateTokenResponse(tokenJson)) {
		return error(500, "Failure getting auth token");
	}

	return tokenJson;
}

function validateTokenResponse(tokenJson: unknown): tokenJson is {
	access_token: string;
	token_type: string;
	expires_in: number;
	id_token: string;
} {
	return (
		Boolean(tokenJson) &&
		typeof tokenJson === "object" &&
		tokenJson !== null &&
		"access_token" in tokenJson &&
		typeof tokenJson.access_token === "string" &&
		"token_type" in tokenJson &&
		typeof tokenJson.token_type === "string" &&
		"expires_in" in tokenJson &&
		typeof tokenJson.expires_in === "number" &&
		"id_token" in tokenJson &&
		typeof tokenJson.id_token === "string"
	);
}

async function getUserInfo(userInfoEndpoint: string, accessToken: string) {
	const userInfoResponse = await fetch(userInfoEndpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!userInfoResponse.ok) {
		return error(500, "Failure getting user info");
	}

	const userInfoJson = await userInfoResponse.json();

	if (!validateUserInfoJson(userInfoJson)) {
		console.error("Invalid user info response. Try checking your username claim?");
		return error(500, "Failure getting user info");
	}

	return userInfoJson;
}

function validateUserInfoJson(userInfoJson: unknown): userInfoJson is {
	[OIDC_USERNAME_CLAIM]: string;
} {
	const tempJson = userInfoJson as { [OIDC_USERNAME_CLAIM]: unknown };
	return (
		typeof userInfoJson === "object" &&
		userInfoJson !== null &&
		OIDC_USERNAME_CLAIM in userInfoJson &&
		typeof tempJson[OIDC_USERNAME_CLAIM] === "string"
	);
}

async function loginAccount(
	username: string,
	idToken: string,
	ipAddress: string,
	userAgent: string,
) {
	const account = await queries.getAccountByUsername(username);
	if (!account) {
		console.log(
			`${getCurrentFormattedDateTime()} · Account "${username}" attempted login but does not exist.`,
		);
		return error(400, "Account does not exist");
	}

	try {
		const session = await createSession(account.id, idToken, ipAddress, userAgent);
		const sessionExpiry = session.expiresAt.toLocaleDateString();
		console.log(
			`${getCurrentFormattedDateTime()} · Account "${username}" logged in, session expiring on ${sessionExpiry}.`,
		);
		return session;
	} catch (err) {
		console.error("Error creating session:", err);
		return error(500, "Failed to create session");
	}
}
