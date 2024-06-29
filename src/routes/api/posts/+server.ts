import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { Post } from "$lib/types";
import { DEFAULT_PER_PAGE } from "$lib";

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
		return error(400, { message: "Invalid parameters" });
	}

	const posts = await locals.pb.collection("posts").getList<Post>(page, perPage, {
		sort: "-created",
		expand: "owner"
	});

	return json(posts);
};
