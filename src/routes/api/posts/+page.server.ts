import type { RawPost, SafeBoard } from "$lib/types";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { TABLE_NAMES } from "$lib";

export const actions = {
	default: async ({ locals, request, fetch }) => {
		const { title, body, boardId } = Object.fromEntries(await request.formData()) as {
			title: string;
			body: string;
			boardId: string;
		};

		if (!boardId) {
			return fail(400, { error: "Please select a board." });
		}

		if (!title || !body) {
			return fail(400, { error: "Please enter a title and body." });
		}

		const post = {
			title,
			body,
			owner: locals.user?.id as string,
			board: boardId
		};

		let createdPost;
		try {
			createdPost = await locals.pb.collection(TABLE_NAMES.posts).create<RawPost>(post);
		} catch (err) {
			// console.log(err.originalError.data.data);

			return fail(500, { error: "Failed to create post." });
		}

		// get name of board
		const board = (await (await fetch(`/api/boards/${boardId}`)).json()) as SafeBoard;

		// return a redirect to the new post
		return redirect(303, `/boards/${board.name}/${createdPost.id}`);
	}
} satisfies Actions;
