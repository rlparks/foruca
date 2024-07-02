import { DEFAULT_PER_PAGE, makePostSafe } from "$lib";
import type { RawPost, SafePost } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url }) => {
	const params = url.searchParams;
	let page: number;
	let perPage: number;
	try {
		page = parseInt(params.get("page") ?? "1");
		perPage = parseInt(params.get("perPage") ?? String(DEFAULT_PER_PAGE));
	} catch (err) {
		return json({ error: "Error: Invalid parameters." }, { status: 400 });
	}

	if (isNaN(page) || isNaN(perPage)) {
		return json({ error: "Error: Invalid parameters." }, { status: 400 });
	}

	const postsRes = await locals.pb.collection("posts").getList<RawPost>(page, perPage, {
		sort: "-created",
		expand: "owner, board"
	});

	const safePosts: SafePost[] = [];

	for (const postKey in postsRes.items) {
		safePosts[postKey] = makePostSafe(postsRes.items[postKey]);
	}

	return json({
		posts: safePosts,
		page: postsRes.page,
		perPage: postsRes.perPage,
		totalItems: postsRes.totalItems
	});
};
