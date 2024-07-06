import type { RawPost } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { makePostSafe, TABLE_NAMES } from "$lib";

export const GET: RequestHandler = async ({ params, locals }) => {
	const postId = params.postId;

	try {
		const postRes = await locals.pb.collection(TABLE_NAMES.posts).getOne<RawPost>(postId, {
			expand: "owner, board"
		});

		return json(makePostSafe(postRes));
	} catch (err) {
		return json({ error: "Post not found." }, { status: 404 });
	}
};
