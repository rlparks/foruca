import { logoutUser } from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	return {
		pageTitle: "",
		pageDescription: "the forum application.",
	};
};

export const actions: Actions = {
	default: logoutUser,
};
