import { logoutUser } from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const posts = await event.locals.queries.getTopLevelPosts();
	return { posts };
};

export const actions: Actions = {
	default: logoutUser,
};
