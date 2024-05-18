<script lang="ts">
	import type { AuthProviderInfo } from "pocketbase";

	let loading = $state(true);

	$effect(() => {
		const provider: AuthProviderInfo = JSON.parse(
			window.sessionStorage.getItem("provider") || "{}"
		);
		window.sessionStorage.removeItem("provider");

		// classic :)
		const params = new URL(window.document.location.href).searchParams;

		if (Object.keys(provider).length === 0 || provider.state !== params.get("state")) {
			// provider from session storage doesn't exist
			// or state param doesn't match
			window.location.href = "/";
		} else {
			// login
			const currentPage: string = window.location.origin + window.location.pathname;
			fetch(currentPage, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					provider,
					code: params.get("code"),
					redirectUrl: currentPage
				})
			}).then((res) => {
				if (res.redirected) {
					window.location.href = res.url;
				} else {
					loading = false;
				}
			});
		}
	});
</script>

<h2 class="text-center">OIDC Login</h2>
{#if loading}
	<p class="text-center">Logging in...</p>
{:else}
	<p class="text-center">Failed to login. Please try again.</p>
{/if}
