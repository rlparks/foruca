import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url }) => {
	const params = url.searchParams;
	let page: number;
	let perPage: number;
	try {
		page = Number(params.get("page")) ?? 1;
		perPage = Number(params.get("perPage")) ?? 10;
	} catch (err) {
		return json({ error: "Error: Invalid parameters." }, { status: 400 });
	}

	const posts = await locals.pb.collection("posts").getList(page, perPage, {
		sort: "-created"
	});

	return json(posts.items);
};
