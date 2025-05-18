import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const canViewPrivateBoards = event.locals.security.isAuthenticated();
	const postId = event.params.postId;
	const post = await event.locals.queries.getPostById(postId);
	if (!post) {
		return error(404, "Post not found");
	}

	if (!(canViewPrivateBoards || post.boardIsPublic)) {
		return error(404, "Post not found");
	}

	if (post.boardName !== event.params.boardName) {
		return redirect(303, `/boards/${post.boardName}/${postId}`);
	}

	return { post, pageTitle: post.title, pageDescription: `Post in ${post.boardName}` };
}) satisfies PageServerLoad;
