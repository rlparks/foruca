import { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD, PB_URL } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

// dangerous!
const adminPb: PocketBase = new PocketBase(PB_URL);
if (PB_ADMIN_EMAIL && PB_ADMIN_PASSWORD) {
	try {
		await adminPb.admins.create({
			email: PB_ADMIN_EMAIL,
			password: PB_ADMIN_PASSWORD,
			passwordConfirm: PB_ADMIN_PASSWORD
		});
		await initializeSchema(adminPb);
	} catch (err) {
		console.log("PB admin already exists");
	}
	// finally {
	// 	if (adminPb) {
	// 		await adminPb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
	// 	}
	// }
}

// const denyAccessResponse = new Response(JSON.stringify({ error: "Error: Unauthorized." }), {
// 	status: 401,
// 	headers: {
// 		"Content-Type": "application/json"
// 	}
// });

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PB_URL);
	// event.locals.adminPb = adminPb;
	try {
		await event.locals.pb.health.check();
	} catch (err) {
		return new Response(JSON.stringify({ error: "Error: Unable to access the database." }), {
			status: 500,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}

	// console.log(event.request.headers);

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	// console.log("user:", event.locals.pb.authStore.model);
	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.model;
	} else {
		event.locals.user = undefined;
	}

	// const denyRes = requireAuth(event.locals.user, event.url.pathname);
	// if (denyRes) {
	// 	return denyRes;
	// }

	const result = await resolve(event);

	result.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false }));

	return result;
};

// function requireAuth(user: AuthModel | undefined, path: string) {
// 	if (!user) {
// 		if (path.startsWith("/api/images")) {
// 			return denyAccessResponse;
// 		}
// 	}

// 	return null;
// }

async function initializeSchema(pb: PocketBase) {
	await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

	await pb.settings.update({
		meta: {
			appName: "foruca"
			// appUrl: APP_URL
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
