import type { PageServerLoad } from "./$types";

// because this is a protected page, this empty load function
// makes the client make a server call and get redirected
export const load = (async () => {
	return {};
}) satisfies PageServerLoad;
