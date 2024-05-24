<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import type { AuthProviderInfo } from "pocketbase";

	const { data } = $props();

	const redirectUrl = $derived(browser ? `${window.location.origin}/login/callback` : undefined);

	function performRedirect(provider: AuthProviderInfo) {
		window.sessionStorage.setItem("provider", JSON.stringify(provider));
		window.location.href = provider.authUrl + redirectUrl;
	}

	let loginButtonText = $state("Login");
</script>

<h2 class="text-center">Login</h2>

<div class="center-h">
	<div>
		<form action="/api/auth/login" method="post">
			<label>Username<input type="text" name="username" /></label>
			<label>Password<input type="password" name="password" /></label>
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
