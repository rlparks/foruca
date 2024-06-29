import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

// in dev, trying to access /api/auth/login in the browser gives a 500 error "missing +page.svelte"
// in production, this is a 404 as it should be
export const actions = {
	default: async ({ locals, request, url }) => {
		const body = Object.fromEntries(await request.formData()) as {
			username: string;
			password: string;
		};

		try {
			await locals.pb.collection("users").authWithPassword(body.username, body.password);
			console.log("LOGIN SUCCESS: " + body.username);
		} catch (err) {
			// console.log(err);
			console.log("LOGIN FAILURE: " + body.username);

			return fail(400, { error: "Invalid credentials." });
		}

		const redirectParam = url.searchParams.get("redirect") ?? "/";

		const redirectUrl = `/${redirectParam.slice(1)}`;

		return redirect(303, redirectUrl);
	}
} satisfies Actions;
