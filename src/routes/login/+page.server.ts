import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	login: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection("users").authWithPassword(body.username, body.password);
		} catch (err) {
			console.log(err);
			return fail(400, { error: "Error logging in" });
		}
	}
} satisfies Actions;
