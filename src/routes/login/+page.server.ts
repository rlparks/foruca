import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	// console.log(event);
	if (event.locals.user) {
		return redirect(303, "/");
	}

	return {};
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
