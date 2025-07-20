import { error, fail, redirect } from "@sveltejs/kit";
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

	async function getReplies() {
		const replies = await event.locals.queries.getRepliesByPostId(postId);
		return replies;
	}

	return { post, replies: getReplies() };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		event.locals.security.enforceAuthenticated();

		const userId = event.locals.user!.id; // will exist due to enforceAuthenticated
		const postId = event.params.postId;
		const formData = await event.request.formData();
		const { body, parentId } = Object.fromEntries(formData.entries()) as {
			body: string;
			parentId: string | undefined;
		};

		if (!body || body.trim().length === 0) {
			return fail(400, { message: "Reply body is required" });
		}

		const maxReplyLength = 5000;
		if (body.length > maxReplyLength) {
			return fail(400, { message: `Reply body must be less than ${maxReplyLength} characters` });
		}

		await event.locals.queries.createReply({
			createdAt: new Date(),
			updatedAt: null,
			userId,
			postId,
			body: body.trim(),
			parentId: parentId || null,
		});

		const boardName = event.params.boardName;
		return redirect(303, `/boards/${boardName}/${postId}`);
	},
};
