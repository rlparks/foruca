import { logoutUser } from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	return {};
};

export const actions: Actions = {
	default: logoutUser,
};
