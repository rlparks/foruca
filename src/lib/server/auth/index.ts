import { generateTextId } from "$lib/server";
import { queries } from "$lib/server/db/queries";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_EXPIRATION = 30 * DAY_IN_MS;
const SESSION_COOKIE_NAME = "foruca-auth-session";

function generateSessionToken() {
	return generateTextId();
}

function hashToken(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

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
}
