import type { RawPost } from "$lib/types";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { TABLE_NAMES } from "$lib";

export const actions = {
	default: async ({ locals, request }) => {
		const { title, body } = Object.fromEntries(await request.formData()) as {
			title: string;
			body: string;
		};

		if (!title || !body) {
			return fail(400, { error: "Error: Title or body not provided." });
		}

		const post = {
			title,
			body,
			owner: locals.user?.id
		};

		// let createdPost;
		try {
			// createdPost =
			await locals.pb.collection(TABLE_NAMES.posts).create<RawPost>(post);
		} catch (err) {
			return fail(500, { error: "Error: Failed to create post." });
		}

		return redirect(303, `/`);
		// TODO: Redirect to post
		// return redirect(303, `/posts/${createdPost.id}`);
	}
} satisfies Actions;
