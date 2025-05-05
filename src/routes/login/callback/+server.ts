import { env } from "$env/dynamic/private";
import { OIDC_STATE_KEY } from "$lib";
import { getAuthProviderInfo } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
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

	console.log(username);

	return new Response();
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
