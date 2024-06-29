import type { Post } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DEFAULT_PER_PAGE } from "$lib";

export const load = (async ({ fetch, url }) => {
	const params = Object.fromEntries(url.searchParams);

	const page = parseInt(params?.page ?? 1);
	const perPage = parseInt(params?.perPage ?? DEFAULT_PER_PAGE);

	const postsRes = await fetch(`/api/posts?page=${page}&perPage=${perPage}`);

	if (!postsRes.ok) {
		return error(postsRes.status, await postsRes.json());
	}

	const posts = await postsRes.json();

	return {
		posts: posts.items as Post[],
		page: posts.page as number,
		perPage: posts.perPage as number,
		totalItems: posts.totalItems as number
	};
}) satisfies PageServerLoad;
