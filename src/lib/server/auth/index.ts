import { generateTextId } from "$lib/server";
import { deleteSessionCookie } from "$lib/server/auth/helpers";
import { getAuthInfo } from "$lib/server/auth/provider";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { type RequestEvent, redirect } from "@sveltejs/kit";

export const SESSION_COOKIE_NAME = "foruca-auth-session";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_EXPIRATION = 30 * DAY_IN_MS;

export async function getAuthProviderInfo() {
	const state = generateTextId();
	return await getAuthInfo(state);
}

export async function createSession(
	event: RequestEvent,
	accountId: string,
	oidcIdToken: string,
	ipAddress: string,
	userAgent: string,
) {
	const token = generateSessionToken();
	const tokenHash = hashToken(token);
	const createdAt = new Date();
	const expiresAt = new Date(Date.now() + SESSION_EXPIRATION);

	const newSession = {
		accountId,
		createdAt,
		lastActivityAt: createdAt,
		lastIp: ipAddress,
		userAgent,
		expiresAt,
	};

	await event.locals.queries.createSession(newSession, tokenHash, oidcIdToken);

	return { token, expiresAt };
}

// TODO: homk
export async function validateSessionToken(
	event: RequestEvent,
	token: string,
	attemptDetails: { ipAddress: string; userAgent: string },
) {
	const tokenHash = hashToken(token);
	const session = await getSessionByTokenHash(event, tokenHash);

	if (!session) {
		return { session: null, user: null };
	}

	const sessionIsExpired = Date.now() > session.expiresAt.getTime();
	if (sessionIsExpired) {
		await invalidateSession(event, session.id);
		return { session: null, user: null };
	}

	// we know session is valid

	// maintain session details
	if (session.lastIp !== attemptDetails.ipAddress) {
		session.lastIp = attemptDetails.ipAddress;
	}

	if (session.userAgent !== attemptDetails.userAgent) {
		session.userAgent = attemptDetails.userAgent;
	}

	const needsRenewal = Date.now() > session.expiresAt.getTime() - SESSION_EXPIRATION / 2;
	if (needsRenewal) {
		session.expiresAt = new Date(Date.now() + SESSION_EXPIRATION);
	}

	const updatedSession = await event.locals.queries.updateSessionById(session.id, {
		lastActivityAt: new Date(),
		expiresAt: session.expiresAt,
		lastIp: session.lastIp,
		userAgent: session.userAgent,
	});

	if (!updatedSession) {
		throw new Error("Session disappeared!");
	}

	const user = {
		id: session.accountId,
		username: session.accountUsername,
		displayName: session.accountDisplayName,
		isAdmin: session.accountIsAdmin,
	};

	return { session: updatedSession, user };
}

export async function logoutUser(event: RequestEvent) {
	if (!event.locals.session) {
		return redirect(303, "/");
	}

	const session = await event.locals.queries.getOidcIdTokenBySessionId(event.locals.session.id);

	deleteSessionCookie(event.cookies);
	await invalidateSession(event, event.locals.session.id);

	// log out of ID provider
	if (session) {
		const { oidcIdToken } = session;
		const { endSessionEndpoint } = await getAuthProviderInfo();

		const logoutUrl = new URL(endSessionEndpoint);
		logoutUrl.searchParams.set("id_token_hint", oidcIdToken);
		logoutUrl.searchParams.set("post_logout_redirect_uri", `${event.url.origin}/`);

		return redirect(303, logoutUrl.toString());
	}

	return redirect(303, "/");
}

function generateSessionToken() {
	return generateTextId();
}

function hashToken(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

async function getSessionByTokenHash(event: RequestEvent, tokenHash: string) {
	return await event.locals.queries.getSessionByTokenHash(tokenHash);
}

async function invalidateSession(event: RequestEvent, sessionId: string) {
	return await event.locals.queries.deleteSessionById(sessionId);
}
