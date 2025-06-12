import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	const { user } = event.locals;

	return { user, pageTitle: "foruca", pageDescription: "the forum application." };
}) satisfies LayoutServerLoad;
