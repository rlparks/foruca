<script lang="ts">
	import { enhance } from "$app/forms";
	import { env } from "$env/dynamic/public";
	import type { PageData } from "./$types";
	import PocketBase from "pocketbase";

	async function loginWithOidc(provider: string) {
		const pb = new PocketBase(env.PUBLIC_PB_URL);
		const authData = await pb.collection("users").authWithOAuth2({ provider: provider });

		console.log("authData", authData);

		await fetch("/login", {
			method: "POST",
			body: pb.authStore.exportToCookie()
		});

		// https://github.com/pocketbase/pocketbase/discussions/3212
		if (authData.meta) {
			const formData = new FormData();

			try {
				const response = await fetch(authData.meta.avatarUrl);

				if (response.ok) {
					const file = await response.blob();
					formData.append("avatar", file);
				}

				formData.append("name", authData.meta.name);

				await pb.collection("users").update(authData.record.id, formData);
			} catch (err) {
				console.error(err);
			}
		}

		location.href = "/";
	}

	async function loginWithGithub() {
		await loginWithOidc("github");
	}

	async function loginWithDiscord() {
		await loginWithOidc("discord");
	}
</script>

<h2 class="text-center">Login</h2>

<div class="center-h">
	<div>
		<form action="?/login" method="post" use:enhance>
			<label>Username<input type="text" name="username" /></label>
			<label>Password<input type="password" name="password" /></label>
			<button type="submit" class="button">Login</button>
		</form>
		<div class="center-h">
			<div id="container-oidc">
				<button onclick={loginWithGithub} class="button oidc">Login with GitHub</button>
				<button onclick={loginWithDiscord} class="button oidc">Login with Discord</button>
			</div>
		</div>
	</div>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
	}

	input {
		margin: 0.5rem 0;
		padding: 0.5rem;
		border-radius: 5px;
	}

	button {
		margin: 0.5rem 0;
		padding: 0.5rem;
	}

	#container-oidc {
		margin-top: 3rem;
		display: flex;
		flex-direction: column;
	}
</style>
