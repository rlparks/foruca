import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceAuthenticated();

	const boardName = event.params.boardName;

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
		const trimmedPostTitle = postTitle.trim();
		const trimmedPostBody = postBody.trim();

		if (!trimmedPostTitle || !trimmedPostBody) {
			return fail(400, { message: "Please fill in all fields" });
		}

		if (trimmedPostTitle.length > 100) {
			return fail(400, { message: "Title is too long" });
		}

		if (trimmedPostBody.length > 2000) {
			return fail(400, { message: "Body is too long" });
		}

		const boardName = event.params.boardName;
		const board = await event.locals.queries.getBoardByName(boardName);

		if (!board) {
			return fail(404, { message: "Board not found" });
		}

		if (!event.locals.user) {
			throw new Error("somehow forgot user");
		}

		const post = await event.locals.queries.createPost({
			title: trimmedPostTitle,
			body: trimmedPostBody,
			boardId: board.id,
			userId: event.locals.user.id,
			createdAt: new Date(),
			updatedAt: null,
		});

		if (!post) {
			return fail(500, { message: "Failed to create post" });
		}

		return redirect(303, `/boards/${boardName}/${post.id}`);
	},
};
