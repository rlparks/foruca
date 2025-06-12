import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const canViewPrivateBoards = event.locals.security.isAuthenticated();
	const posts = canViewPrivateBoards
		? await event.locals.queries.getPosts()
		: await event.locals.queries.getPublicPosts();
	return { posts };
};
