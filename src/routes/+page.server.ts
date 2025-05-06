import { logoutUser } from "$lib/server/auth";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: logoutUser,
};
