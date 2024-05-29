<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import type { AuthProviderInfo } from "pocketbase";
	import { onMount } from "svelte";

	const { data } = $props();

	const redirectUrl = $derived(browser ? `${window.location.origin}/login/callback` : undefined);

	function performRedirect(provider: AuthProviderInfo) {
		window.sessionStorage.setItem("provider", JSON.stringify(provider));
		window.location.href = provider.authUrl + redirectUrl;
	}

	let loginButtonText = $state("Login");
	let error: string | undefined = $state(undefined);

	onMount(() => {
		document.getElementById("usernameInput")?.focus();
	});
</script>

<sveltekit:head>
	<title>foruca · login</title>
</sveltekit:head>

<h2 class="text-center">Login</h2>

<div id="loginContainer">
	<div class="center-h">
		{#if error}
			<p class="text-center error">{error}</p>
		{/if}
		<form
			action="/api/auth/login"
			method="post"
			use:enhance={() => {
				loginButtonText = "Logging in...";
				error = undefined;

				return async function ({ update, result }) {
					await update();
					loginButtonText = "Login";
					if (result.type === "failure" && result?.data?.error) {
						error = String(result?.data?.error);
					}
				};
			}}
		>
			<label>Username<input id="usernameInput" type="text" name="username" required /></label>
			<label>Password<input type="password" name="password" required /></label>
			<button type="submit" class="button" disabled={loginButtonText !== "Login"}
				>{loginButtonText}</button
			>
		</form>
	</div>
	{#if data.ssoProviders}
		<div class="center-h">
			<div id="container-oidc">
				{#each data.ssoProviders as provider (provider.name)}
					<button
						onclick={() => {
							performRedirect(provider);
						}}
						class="button">Login with {provider.displayName}</button
					>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
	}

	#container-oidc {
		margin-top: 3rem;
		display: flex;
		flex-direction: column;
	}

	.error {
		color: red;
	}

	#loginContainer {
		display: flex;
		justify-content: space-evenly;
		flex-direction: row-reverse;
	}

	@media (max-width: 600px) {
		#loginContainer {
			display: block;
		}
	}
</style>
