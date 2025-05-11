import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const canViewPrivateBoards = event.locals.security.isAuthenticated();

	const boardName = event.params.boardName;
	const board = await event.locals.queries.getBoardByName(boardName);

	if (!board) {
		return error(404, "Board not found");
	}

	// don't expose board existence to untrustworthy individuals
	if (!canViewPrivateBoards && !board.isPublic) {
		return error(404, "Board not found");
	}

	return { board };
}) satisfies PageServerLoad;
