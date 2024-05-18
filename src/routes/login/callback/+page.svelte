<script lang="ts">
	import type { AuthProviderInfo } from "pocketbase";

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
			fetch("http://localhost:5173/login/callback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					provider,
					code: params.get("code"),
					redirectUrl: "http://localhost:5173/login/callback"
				})
			});
		}
	});
</script>

<h2 class="text-center">OIDC Login</h2>

<p class="text-center">Failed to login. Please try again.</p>
