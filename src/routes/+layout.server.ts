import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	if (locals.user) {
		// console.log("user:", locals.user);

		return {
			user: locals.user
		};
	}

	return {
		user: undefined
	};
}) satisfies LayoutServerLoad;
