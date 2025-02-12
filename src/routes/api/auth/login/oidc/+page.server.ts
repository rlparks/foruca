import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { ClientResponseError, type AuthProviderInfo } from "pocketbase";
import { OIDC_REDIRECT_COOKIE_NAME, TABLE_NAMES } from "$lib";

export const actions = {
	default: async ({ locals, request, cookies }) => {
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
				.collection(TABLE_NAMES.users)
				.authWithOAuth2Code(providerObj.name, code, providerObj.codeVerifier, redirectUrl);

			let username = undefined;
			if (authData.meta) {
				username = authData.meta.username;
			}

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

			try {
				await pb
					.collection(TABLE_NAMES.users)
					.update(authData.record.id, { username, name, avatar });
			} catch (err) {
				if (err instanceof ClientResponseError) {
					console.error(
						"Error updating user, likely due to duplicate username:",
						err.originalError.data.data
					);
				}
			}

			console.log("OIDC LOGIN SUCCESS: " + authData.record.username);
		} catch (err) {
			if (err instanceof ClientResponseError) {
				console.error("Client response error:", err.originalError.data.data);
			}
			return fail(400, { error: "Error: Cannot parse body." });
		}

		// a little silly, isn't it?
		const postLoginRedirectUrl = `/${(cookies.get(OIDC_REDIRECT_COOKIE_NAME) ?? "/")?.slice(1)}`;

		cookies.delete(OIDC_REDIRECT_COOKIE_NAME, {
			path: "/"
		});

		return redirect(303, postLoginRedirectUrl);
	}
} satisfies Actions;
