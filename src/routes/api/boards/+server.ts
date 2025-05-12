import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// response will include only the boards the user has access to
export const GET: RequestHandler = async (event) => {
	const canViewPrivateBoards = event.locals.security.isAuthenticated();

	try {
		if (canViewPrivateBoards) {
			const boards = await event.locals.queries.getBoards();
			return json(boards);
		} else {
			const boards = await event.locals.queries.getPublicBoards();
			return json(boards);
		}
	} catch (err) {
		console.error(err);
		return error(500, "Error fetching boards");
	}
};
