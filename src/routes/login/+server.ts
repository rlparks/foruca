import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
	event.locals.pb.authStore.loadFromCookie((await event.request.text()) || "");

	throw redirect(303, "/");
};
