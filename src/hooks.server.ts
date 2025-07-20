import { building } from "$app/environment";
import { auth } from "$lib/server/auth";
import Security from "$lib/server/auth/Security";
import { getInstance } from "$lib/server/db/postgres";
import { Queries } from "$lib/server/db/Queries";
import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";

const setupDb: Handle = async ({ event, resolve }) => {
	event.locals.queries = new Queries(getInstance(true));

	return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const ip = event.getClientAddress();
	event.request.headers.set("x-forwarded-for", ip);

	return svelteKitHandler({ event, resolve, auth, building });
};

const setLocals: Handle = async ({ event, resolve }) => {
	const { user, session } = (await auth.api.getSession({ headers: event.request.headers })) ?? {
		user: null,
		session: null,
	};

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
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

export const handle = sequence(setupDb, handleAuth, setLocals, setHeaders);
