import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	if (event.locals.user) {
		// don't let people visit this page if they're already logged in
		return redirect(303, "/");
	}

	const ssoProviders = await (await event.fetch("/api/auth/methods")).json();

	return { ssoProviders: ssoProviders.authProviders };
}) satisfies PageServerLoad;

// export const actions = {
// 	login: async ({ locals, request, fetch, cookies }) => {
// 		const body = JSON.stringify(Object.fromEntries(await request.formData()));

// 		const res = await fetch("/api/auth/login", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json"
// 			},
// 			body
// 		});

// 		if (!res.ok) {
// 			return fail(400, { error: "Error logging in" });
// 		}

// 		const setCookie = res.headers.get("set-cookie");
// 		if (!setCookie) {
// 			return fail(400, { error: "Error logging in" });
// 		}

// 		const cookieCrumbs = setCookie.split("; ");
// 		console.log(cookieCrumbs);
// 		const cookieKeyValue = cookieCrumbs[0].split("=");
// 		const cookiePath = cookieCrumbs[1].split("=");
// 		const cookieExpires = cookieCrumbs[2].split("=");
// 		const httpOnly = cookieCrumbs[3].split("=");
// 		const secure = cookieCrumbs[4].split("=");

// 		cookies.set(cookieKeyValue[0], cookieKeyValue[1], {
// 			path: cookiePath[1],
// 			expires: new Date(cookieExpires[1]),
// 			httpOnly: httpOnly[1] === "true",
// 			secure: secure[1] === "true"
// 		});

// 		return redirect(303, "/");
// 	}
// } satisfies Actions;
