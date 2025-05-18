import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceAdmin();
	return {
		boards: event.locals.queries.getBoards(),
		pageTitle: "Manage Boards",
		pageDescription: "Admin: manage boards",
	};
}) satisfies PageServerLoad;
