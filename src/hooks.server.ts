import { PB_URL } from "$env/static/private";
import { getImageUrl } from "$lib/utils/helpers";
import type { Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PB_URL);
	// console.log(event.locals.pb);

	// console.log(event.request.headers);

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	console.log("user:", event.locals.pb.authStore.model);
	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.model;
		if (event.locals.user?.avatar) {
			// console.log("avatar:", event.locals.pb.authStore.model?.avatar);
			// console.log("user:", event.locals.user);

			// exposes PB url to client
			event.locals.user.avatarUrl = getImageUrl(
				event.locals.user.collectionId,
				event.locals.user.id,
				event.locals.user.avatar
			);
		}
	} else {
		event.locals.user = undefined;
	}

	const result = await resolve(event);

	result.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false }));

	return result;
};
