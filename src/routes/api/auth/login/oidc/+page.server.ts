import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { AuthProviderInfo } from "pocketbase";

export const actions = {
	default: async ({ locals, request }) => {
		const pb = locals.pb;

		try {
			const { provider, code } = Object.fromEntries(await request.formData()) as {
				provider: string;
				code: string;
			};

			if (!provider || !code) {
				return fail(400, { error: "Error: Provider or code not provided." });
			}

			const providerObj = JSON.parse(provider) as AuthProviderInfo;

			// should be the URL this was called from
			const redirectUrl = request.headers.get("referer")?.split("?")[0] ?? "/";

			const authData = await pb
				.collection("users")
				.authWithOAuth2Code(providerObj.name, code, providerObj.codeVerifier, redirectUrl);

			let username = undefined;
			if (providerObj.name === "google" && authData.meta) {
				username = authData.meta.email.split("@")[0];
				authData.meta.username = username;
			}

			const name: string = authData?.meta?.name ?? "";
			const avatarUrl: string = authData?.meta?.avatarUrl ?? "";

			// if this is set to undefined, it will not remove avatar if the
			// OIDC provider doesn't provide one
			let avatar: Blob | null = null;
			if (avatarUrl) {
				const avatarRes = await fetch(avatarUrl);
				avatar = await avatarRes.blob();
			}

			await pb.collection("users").update(authData.record.id, { username, name, avatar });

			console.log("OIDC LOGIN SUCCESS: " + authData?.meta?.username);
		} catch (err) {
			console.error(err);
			return fail(400, { error: "Error: Cannot parse body." });
		}

		return redirect(303, "/");
	}
} satisfies Actions;
