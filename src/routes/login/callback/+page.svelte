<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { AuthProviderInfo } from "pocketbase";

	let loading = $state(true);

	let provider: AuthProviderInfo | undefined = $state();
	let code: string | undefined = $derived($page.url.searchParams.get("code") ?? "");

	$effect(() => {
		const providerString: string | null = window.sessionStorage.getItem("provider");
		if (providerString) {
			provider = JSON.parse(providerString);
			window.sessionStorage.removeItem("provider");
		}

		// classic :)
		const params = new URL(window.document.location.href).searchParams;

		if (!provider || provider.state !== params.get("state")) {
			// provider from session storage doesn't exist
			// or state param doesn't match
			goto("/");
		} else {
			// login
			document.getElementById("providerInput")?.setAttribute("value", JSON.stringify(provider));
			document.getElementById("codeInput")?.setAttribute("value", code);
			(document.getElementById("oidcLogin") as HTMLFormElement)?.submit();
		}
	});
</script>

<sveltekit:head>
	<title>foruca · SSO Callback</title>
</sveltekit:head>

<h2 class="text-center">OIDC Login</h2>
{#if loading}
	<p class="text-center">Logging in...</p>
{:else}
	<p class="text-center">Failed to login. Please try again.</p>
{/if}

<form id="oidcLogin" action="/api/auth/login/oidc" method="POST" use:enhance>
	<input id="providerInput" name="provider" type="hidden" />
	<input id="codeInput" name="code" type="hidden" />
</form>
