<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import type { AuthProviderInfo } from "pocketbase";

	const { data } = $props();
	const { redirect } = $derived(data);

	const oidcRedirectUrl = $derived(
		browser ? `${window.location.origin}/login/callback` : undefined
	);

	function performRedirect(provider: AuthProviderInfo) {
		window.sessionStorage.setItem("provider", JSON.stringify(provider));

		if (redirect) {
			let redirectCookieString = `foruca-oidc-login-redirect=${redirect}; Path=/; SameSite=strict; Max-Age=180;`;
			const isSecure = window.location.protocol === "https:";
			if (isSecure) {
				redirectCookieString += " Secure;";
			}
			window.document.cookie = redirectCookieString;
		}

		window.location.href = provider.authUrl + oidcRedirectUrl;
	}

	let loginButtonText = $state("Login");
	let error: string | undefined = $state(undefined);

	$effect(() => {
		document.getElementById("usernameInput")?.focus();

		if (redirect) {
			error = "Please login to access this page.";
		}
	});
</script>

<svelte:head>
	<title>foruca · login</title>
	<meta name="description" content="Login to foruca." />
</svelte:head>

<h1 class="text-center page-title">Login</h1>

<div class="center-h">
	<div>
		{#if error}
			<p class="text-center error">{error}</p>
		{/if}
		<form
			action="/api/auth/login?redirect={redirect}"
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
</style>
