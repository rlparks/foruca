import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { AuthProviderInfo } from "pocketbase";

export const POST: RequestHandler = async (event) => {
	const pb = event.locals.pb;

	try {
		const {
			provider,
			code,
			redirectUrl
		}: {
			provider: AuthProviderInfo;
			code: string;
			redirectUrl: string;
		} = await event.request.json();

		const authData = await pb
			.collection("users")
			.authWithOAuth2Code(provider.name, code, provider.codeVerifier, redirectUrl);

		console.log(authData);
	} catch (err) {
		console.error(err);
		return new Response("Error parsing body.", { status: 400 });
	}

	throw redirect(303, "/");
};
