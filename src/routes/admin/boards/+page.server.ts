import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	return { boards: event.locals.queries.getBoards() };
}) satisfies PageServerLoad;
