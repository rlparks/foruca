import { APP_URL, PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } from "$env/static/private";
import { getImageUrl } from "$lib/utils/helpers";
import type { Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

if (PB_ADMIN_EMAIL && PB_ADMIN_PASSWORD) {
	try {
		const tempPb = new PocketBase(PB_URL);
		await tempPb.admins.create({
			email: PB_ADMIN_EMAIL,
			password: PB_ADMIN_PASSWORD,
			passwordConfirm: PB_ADMIN_PASSWORD
		});
		await initializeSchema(tempPb);
	} catch (err) {
		console.log("PB admin already exists");
	}
}

const denyAccess = new Response(
	JSON.stringify({ error: "Error: Unable to access the database." }),
	{
		status: 500,
		headers: {
			"Content-Type": "application/json"
		}
	}
);

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PB_URL);
	event.locals.pbAlive = true;
	try {
		await event.locals.pb.health.check();
	} catch (err) {
		// console.error(err);
		event.locals.pbAlive = false;
	}

	// console.log(event.request.headers);

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	// console.log("user:", event.locals.pb.authStore.model);
	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.model;
	} else {
		event.locals.user = undefined;
	}

	const result = await resolve(event);

	result.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false }));

	return result;
};

async function initializeSchema(pb: PocketBase) {
	await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

	const settings = await pb.settings.update({
		meta: {
			appName: "foruca",
			appUrl: APP_URL
		}
	});

	try {
		const users = await pb.collections.getOne("users");
		await pb.collections.update(users.name, {
			viewRule: "@request.auth.id != ''"
		});
		const posts = await pb.collections.create({
			name: "posts",
			type: "base",
			viewRule: "",
			createRule: "@request.auth.id != ''",
			schema: [
				{
					name: "title",
					type: "text",
					required: true
				},
				{
					name: "body",
					type: "text"
				},
				{
					name: "owner",
					type: "relation",
					required: true,
					options: {
						collectionId: users.id,
						maxSelect: 1
					}
				},
				{
					name: "time",
					type: "date",
					required: true
				}
			]
		});

		await pb.collections.update(posts.name, {
			schema: [
				...posts.schema,
				{
					name: "parent",
					type: "relation",
					required: false,
					options: {
						collectionId: posts.id,
						maxSelect: 1
					}
				}
			]
		});
	} catch (err) {
		console.log("Error creating posts collection:", err);
	}
}
