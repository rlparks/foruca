import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
	event.locals.pb.authStore.clear();
	event.locals.user = undefined;

	return redirect(303, "/");
};
