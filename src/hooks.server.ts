import { getCurrentFormattedDateTime } from "$lib";
import { getAuthProviderInfo, SESSION_COOKIE_NAME, validateSessionToken } from "$lib/server/auth";
import { deleteSessionCookie, setSessionCookie } from "$lib/server/auth/helpers";
import { error, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

console.log(await getAuthProviderInfo());

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
	if (!sessionToken) {
		event.locals.session = null;
		event.locals.account = null;
		return resolve(event);
	}

	// user has some kind of token
	const ipAddress = event.getClientAddress();
	const userAgent = event.request.headers.get("user-agent") || "";
	try {
		const { session, user } = await validateSessionToken(sessionToken, {
			ipAddress,
			userAgent,
		});

		if (session) {
			setSessionCookie(event.cookies, sessionToken, session.expiresAt);
		} else {
			deleteSessionCookie(event.cookies);
		}

		event.locals.session = session;
		event.locals.account = user;

		return resolve(event);
	} catch (err) {
		const currentTime = getCurrentFormattedDateTime();
		console.error(
			`${currentTime} · ${ipAddress} · ${userAgent} · Error during authentication: ${err}`,
		);

		return error(500, "Error during authentication!");
	}
};

const setHeaders: Handle = async ({ event, resolve }) => {
	const start = performance.now();

	const result = await resolve(event);

	if (!event.isSubRequest) {
		console.log(
			`${event.request.method} ${event.url.pathname}: ${(performance.now() - start).toFixed(2)}ms`,
		);
	}

	result.headers.set("referrer-policy", "strict-origin-when-cross-origin");
	result.headers.set("x-content-type-options", "nosniff");
	result.headers.set("x-frame-options", "DENY");
	result.headers.set("cross-origin-resource-policy", "same-origin");
	result.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");

	return result;
};

export const handle = sequence(handleAuth, setHeaders);
