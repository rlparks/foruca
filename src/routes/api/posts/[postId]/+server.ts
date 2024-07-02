import type { RawPost } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { makePostSafe } from "$lib";

export const GET: RequestHandler = async ({ params, locals }) => {
	const postId = params.postId;

	try {
		const postRes = await locals.pb.collection("posts").getOne<RawPost>(postId, {
			expand: "owner, board"
		});

		return json(makePostSafe(postRes));
	} catch (err) {
		return json({ error: "Post not found." }, { status: 404 });
	}
};
