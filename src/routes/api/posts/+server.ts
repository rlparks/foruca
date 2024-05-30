import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { Post } from "$lib/types";

export const GET: RequestHandler = async ({ locals, url }) => {
	const params = url.searchParams;
	let page: number;
	let perPage: number;
	try {
		page = parseInt(params.get("page") ?? "1");
		perPage = parseInt(params.get("perPage") ?? "10");
	} catch (err) {
		return json({ error: "Error: Invalid parameters." }, { status: 400 });
	}

	const posts = await locals.pb.collection("posts").getList<Post>(page, perPage, {
		sort: "-created",
		expand: "owner"
	});

	return json(posts);
};
