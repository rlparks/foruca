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

		// console.log(authData);

		const name: string = authData?.meta?.name ?? "";
		const avatarUrl: string = authData?.meta?.avatarUrl ?? "";

		let avatar: Blob | undefined = undefined;

		if (avatarUrl) {
			const avatarRes = await fetch(avatarUrl);
			avatar = await avatarRes.blob();
		}

		await pb.collection("users").update(authData.record.id, { name, avatar });
	} catch (err) {
		console.error(err);
		return new Response("Error parsing body.", { status: 400 });
	}

	return redirect(303, "/");
};
