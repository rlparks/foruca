import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceAuthenticated();

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		event.locals.security.enforceAuthenticated();

		const formData = await event.request.formData();
		const { postTitle, postBody } = Object.fromEntries(formData) as {
			postTitle: string;
			postBody: string;
		};

		if (!postTitle || !postBody) {
			return fail(400, { message: "Please fill in all fields" });
		}

		if (postTitle.length > 100) {
			return fail(400, { message: "Title is too long" });
		}

		if (postBody.length > 2000) {
			return fail(400, { message: "Body is too long" });
		}

		const boardName = event.params.boardName;
		const board = await event.locals.queries.getBoardByName(boardName);

		if (!board) {
			return fail(404, { message: "Board not found" });
		}

		if (!event.locals.account) {
			throw new Error("somehow forgot account");
		}

		const post = await event.locals.queries.createPost({
			title: postTitle.trim(),
			body: postBody.trim(),
			boardId: board.id,
			accountId: event.locals.account.id,
			createdAt: new Date(),
			updatedAt: null,
			parentId: null,
		});

		if (!post) {
			return fail(500, { message: "Failed to create post" });
		}

		return redirect(303, `/boards/${boardName}`);
		// TODO: redirect to new post
		// return redirect(303, `/boards/${boardName}/${post.id}`);
	},
};
