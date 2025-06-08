import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

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

	const postBodyPreview = post.body.slice(0, 100);

	return { post, pageTitle: post.title, pageDescription: postBodyPreview };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		event.locals.security.enforceAuthenticated();

		const accountId = event.locals.account!.id; // will exist due to enforceAuthenticated
		const postId = event.params.postId;
		const formData = await event.request.formData();
		const { body, parentId } = Object.fromEntries(formData.entries()) as {
			body: string;
			parentId: string | undefined;
		};

		await event.locals.queries.createReply({
			createdAt: new Date(),
			updatedAt: new Date(),
			accountId,
			postId,
			body,
			parentId: parentId || null,
		});

		const boardName = event.params.boardName;
		return redirect(303, `/boards/${boardName}/${postId}`);
	},
};
