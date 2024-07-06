import { makeUserSafe } from "$lib";
import type { RawUser } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	if (locals.user) {
		// console.log("user:", locals.user);

		return {
			user: makeUserSafe(locals.user as RawUser)
		};
	}

	return {
		user: undefined
	};
}) satisfies LayoutServerLoad;
