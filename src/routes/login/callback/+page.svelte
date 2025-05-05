<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { OIDC_STATE_KEY } from "$lib";

	let oidcForm: HTMLFormElement;
	let codeInput: HTMLInputElement;

	let paramsError = $state("");

	$effect(() => {
		const code = page.url.searchParams.get("code");
		const urlState = page.url.searchParams.get("state");

		if (code && urlState) {
			const savedState = window.sessionStorage.getItem(OIDC_STATE_KEY);
			window.sessionStorage.removeItem(OIDC_STATE_KEY);

			if (savedState === urlState) {
				codeInput.value = code;
				oidcForm.submit();
			} else {
				paramsError = "Invalid state. Try logging in again?";
			}
		} else {
			paramsError = "No parameters provided. Try logging in again?";
		}
	});
</script>

<div
	class="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-baseline lg:px-8"
>
	<aside class="w-full md:w-1/4 lg:w-1/5">
		<h2 class="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Also try</h2>
		<a href="https://whereisjohnseafood.rlparks.net/" class="text-blue-600 hover:underline">
			John Seafood Tracker
		</a>
	</aside>

	<main class="w-full md:w-3/4 lg:w-4/5">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="justify-baseline text-xl font-semibold text-gray-800">OIDC Login</h2>
		</div>

		{#if !page.error && !paramsError}
			<p>Logging in...</p>
		{:else if page.error}
			<p class="text-red-500">{page.error.message}</p>
		{:else if paramsError}
			<p class="text-red-500">{paramsError}</p>
		{/if}
	</main>

	<form bind:this={oidcForm} method="POST" use:enhance>
		<input bind:this={codeInput} name="code" type="hidden" />
	</form>
</div>
