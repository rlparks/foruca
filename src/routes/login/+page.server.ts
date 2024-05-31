import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	if (event.locals.user) {
		// don't let people visit this page if they're already logged in
		return redirect(303, "/");
	}

	const ssoProviders = await (await event.fetch("/api/auth/methods")).json();
	const redirectUrl: string | null = event.url.searchParams.get("redirect");

	return { ssoProviders: ssoProviders.authProviders, redirect: redirectUrl };
}) satisfies PageServerLoad;
