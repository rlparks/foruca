import { OIDC_STATE_KEY } from "$lib";
import { getAuthProviderInfo } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// https://github.com/lucia-auth/example-sveltekit-github-oauth/blob/main/src/routes/login/github/%2Bserver.ts
export const GET: RequestHandler = async (event) => {
	const authInfo = await getAuthProviderInfo();
	const redirectUrl = new URL(authInfo.authEndpoint);
	redirectUrl.searchParams.set("redirect_uri", event.url.origin + "/login/callback");

	event.cookies.set(OIDC_STATE_KEY, authInfo.state, {
		httpOnly: true,
		secure: true,
		sameSite: "lax", // can not read this at /login/callback if strict
		maxAge: 60 * 5, // 5 minutes
		path: "/",
	});

	return redirect(303, redirectUrl.toString());
};
