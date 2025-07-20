import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const canViewPrivateBoards = event.locals.security.isAuthenticated();
	const { board } = await event.parent();

	if (!board) {
		return error(404, "Board not found");
	}

	// don't expose board existence to untrustworthy individuals
	if (!canViewPrivateBoards && !board.isPublic) {
		return error(404, "Board not found");
	}

	const posts = await event.locals.queries.getPostsByBoardId(board.id);

	return { board, posts };
}) satisfies PageServerLoad;
