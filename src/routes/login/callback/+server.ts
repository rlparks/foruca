import { OIDC_STATE_KEY } from "$lib";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	const storedState = event.cookies.get(OIDC_STATE_KEY);
	event.cookies.delete(OIDC_STATE_KEY, { path: "/" });

	const code = event.url.searchParams.get("code");
	const urlState = event.url.searchParams.get("state");

	if (!storedState || !code || !urlState) {
		return error(400, "Invalid parameters!");
	}

	if (storedState !== urlState) {
		return error(400, "Invalid parameters!");
	}

	return new Response();
};
