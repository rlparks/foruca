import { queries } from "$lib/server/db/queries";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const account = await queries.getAccountById("LTuGw16pTbElMTqkHDi6Q");
console.log(account);

const setLocals: Handle = async ({ event, resolve }) => {
	const result = await resolve(event);

	return result;
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

export const handle = sequence(setLocals, setHeaders);
