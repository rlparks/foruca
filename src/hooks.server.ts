import { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD, PB_URL } from "$env/static/private";
import { json, redirect, type Handle } from "@sveltejs/kit";
import PocketBase, { type AuthModel } from "pocketbase";

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
	} finally {
		if (adminPb) {
			await adminPb.authStore.clear();
		}
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PB_URL);
	try {
		await event.locals.pb.health.check();
	} catch (err) {
		return json({ error: "Error: Unable to access the database." }, { status: 500 });
	}

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.model;
	} else {
		event.locals.user = undefined;
	}

	const denyRes = requireAuth(event.locals.user, event.url.pathname);
	if (denyRes) {
		return redirect(
			303,
			`/login?${new URLSearchParams({ redirect: event.url.pathname + event.url.search }).toString()}`
		);
	}

	const result = await resolve(event);

	// TODO
	result.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false }));

	return result;
};

function requireAuth(user: AuthModel | undefined, path: string) {
	if (!user) {
		if (path.startsWith("/new")) {
			return true;
		}
	}

	return false;
}

async function initializeSchema(pb: PocketBase) {
	await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

	await pb.settings.update({
		meta: {
			appName: "foruca"
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
			listRule: "",
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

		// public_users
		// await pb.collections.create({
		// 	name: "public_users",
		// 	type: "view",
		// 	viewRule: "@request.auth.id != ''",
		// 	options: {
		// 		query: "SELECT id, username, name, avatar FROM users"
		// 	}
		// });
	} catch (err) {
		console.log("Error creating posts collection:", err);
	}
}
