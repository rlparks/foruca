import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	const { account } = event.locals;

	return { account, pageTitle: "foruca", pageDescription: "the forum application." };
}) satisfies LayoutServerLoad;
