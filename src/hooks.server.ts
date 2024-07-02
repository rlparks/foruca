import { env } from "$env/dynamic/private";
import { error, redirect, type Handle } from "@sveltejs/kit";
import PocketBase, { type AuthModel } from "pocketbase";

if (!env.PB_URL || !env.PB_ADMIN_EMAIL || !env.PB_ADMIN_PASSWORD) {
	console.log("PB_URL, PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set");
	process.exit(1);
}

const adminPb: PocketBase = new PocketBase(env.PB_URL);
if (env.PB_ADMIN_EMAIL && env.PB_ADMIN_PASSWORD) {
	try {
		await adminPb.admins.create({
			email: env.PB_ADMIN_EMAIL,
			password: env.PB_ADMIN_PASSWORD,
			passwordConfirm: env.PB_ADMIN_PASSWORD
		});
		await initializeSchema(adminPb);
	} catch (err) {
		console.log("PB admin already exists");
	} finally {
		if (adminPb) {
			adminPb.authStore.clear();
		}
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(env.PB_URL);
	try {
		await event.locals.pb.health.check();
	} catch (err) {
		console.log(err);
		return error(500, "Error: Unable to access the database.");
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
	result.headers.append("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false }));

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
	if (env.PB_ADMIN_EMAIL && env.PB_ADMIN_PASSWORD) {
		await pb.admins.authWithPassword(env.PB_ADMIN_EMAIL, env.PB_ADMIN_PASSWORD);
	}

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

		const boards = await pb.collections.create({
			name: "boards",
			type: "base",
			listRule: "",
			viewRule: "",
			createRule: "@request.auth.id != ''",
			schema: [
				{
					name: "name",
					type: "text",
					required: true
				}
			]
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
				},
				{
					name: "board",
					type: "relation",
					required: true,
					options: {
						collectionId: boards.id,
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
	} catch (err) {
		console.log("Error creating posts collection:", err);
	}
}
