import { getCurrentFormattedDateTime } from "$lib";
import { SESSION_COOKIE_NAME, validateSessionToken } from "$lib/server/auth";
import { deleteSessionCookie, setSessionCookie } from "$lib/server/auth/helpers";
import Security from "$lib/server/auth/Security";
import { getInstance } from "$lib/server/db/postgres";
import { Queries } from "$lib/server/db/Queries";
import { error, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const setupDb: Handle = async ({ event, resolve }) => {
	event.locals.queries = new Queries(getInstance(true));

	return resolve(event);
};

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
		const { session, user } = await validateSessionToken(event, sessionToken, {
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
		if (err instanceof Error) {
			console.error(err.message);
			console.error(err.stack);
		}

		return error(500, "Error during authentication!");
	}
};

const setHeaders: Handle = async ({ event, resolve }) => {
	event.locals.security = new Security(event);

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

// https://posthog.com/docs/advanced/proxy/sveltekit
const posthogProxy: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	if (pathname.startsWith("/ingest")) {
		const hostname = pathname.startsWith("/ingest/static/")
			? "us-assets.i.posthog.com"
			: "us.i.posthog.com";

		const url = new URL(event.request.url);
		url.protocol = "https:";
		url.hostname = hostname;
		url.port = "443";
		url.pathname = pathname.replace("/ingest/", "");

		const headers = new Headers(event.request.headers);
		headers.set("host", hostname);

		const response = await fetch(url.toString(), {
			method: event.request.method,
			headers,
			body: event.request.body,
			duplex: "half",
		} as RequestInit);

		return response;
	}

	const response = await resolve(event);
	return response;
};

export const handle = sequence(posthogProxy, setupDb, handleAuth, setHeaders);
