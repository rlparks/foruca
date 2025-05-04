import { generateTextId } from "$lib/server";
import { queries } from "$lib/server/db/queries";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

export const SESSION_COOKIE_NAME = "foruca-auth-session";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_EXPIRATION = 30 * DAY_IN_MS;

export async function createSession(
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

	await queries.createSession(newSession, tokenHash, oidcIdToken);

	return { token, expiresAt };
}

// TODO: homk
export async function validateSessionToken(
	token: string,
	attemptDetails: { ipAddress: string; userAgent: string },
) {
	const tokenHash = hashToken(token);
	const session = await getSessionByTokenHash(tokenHash);

	if (!session) {
		return null;
	}

	const sessionIsExpired = Date.now() > session.expiresAt.getTime();
	if (sessionIsExpired) {
		await invalidateSession(session.id);
		return null;
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

	const updatedSession = await queries.updateSessionById(session.id, {
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

function generateSessionToken() {
	return generateTextId();
}

function hashToken(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

async function getSessionByTokenHash(tokenHash: string) {
	return await queries.getSessionByTokenHash(tokenHash);
}

async function invalidateSession(sessionId: string) {
	return await queries.deleteSessionById(sessionId);
}
