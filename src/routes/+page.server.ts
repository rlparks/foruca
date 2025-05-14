import { logoutUser } from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const canViewPrivateBoards = event.locals.security.isAuthenticated();
	const posts = canViewPrivateBoards
		? await event.locals.queries.getTopLevelPosts()
		: await event.locals.queries.getPublicTopLevelPosts();
	return { posts };
};

export const actions: Actions = {
	default: logoutUser,
};
