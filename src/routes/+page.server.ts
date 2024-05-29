import type { Post } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, url }) => {
	const params = Object.fromEntries(url.searchParams);

	const page = parseInt(params?.page ?? 1);
	const perPage = parseInt(params?.perPage ?? 10);

	const posts: Post[] = await (await fetch(`/api/posts?page=${page}&perPage=${perPage}`)).json();

	return { posts };
}) satisfies PageServerLoad;
