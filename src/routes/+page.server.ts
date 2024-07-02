import { DEFAULT_PER_PAGE } from "$lib";
import type { SafePost } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, url }) => {
	const params = Object.fromEntries(url.searchParams);

	const page = parseInt(params?.page ?? 1);
	const perPage = parseInt(params?.perPage ?? DEFAULT_PER_PAGE);

	const postsRes = await fetch(`/api/posts?page=${page}&perPage=${perPage}`);

	if (!postsRes.ok) {
		return error(postsRes.status, await postsRes.json());
	}

	const postsResJson = await postsRes.json();

	return {
		posts: postsResJson.posts as SafePost[],
		page: postsResJson.page as number,
		perPage: postsResJson.perPage as number,
		totalItems: postsResJson.totalItems as number
	};
}) satisfies PageServerLoad;
