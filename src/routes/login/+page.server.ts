import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { OAuth2UrlCallback } from "pocketbase";

export const load = (async (event) => {
	if (event.locals.user) {
		// don't let people visit this page if they're already logged in
		return redirect(303, "/");
	}

	const ssoProviders = await event.locals.pb.collection("users").listAuthMethods();
	// console.log(ssoProviders);

	return { ssoProviders: ssoProviders.authProviders };
}) satisfies PageServerLoad;

export const actions = {
	login: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData()) as {
			username: string;
			password: string;
		};

		try {
			await locals.pb.collection("users").authWithPassword(body.username, body.password);
		} catch (err) {
			console.log(err);
			return fail(400, { error: "Error logging in" });
		}

		return redirect(303, "/");
	}
} satisfies Actions;
