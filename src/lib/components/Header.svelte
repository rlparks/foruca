<script lang="ts">
	import { enhance } from "$app/forms";
	import { authClient } from "$lib/auth-client";
	import BoardSearcher from "$lib/components/BoardSearcher.svelte";
	import type { Account } from "$lib/types";
	import Button from "./Button.svelte";

	type Props = {
		account: Account | null;
	};
	let { account }: Props = $props();
</script>

<header class="bg-white shadow-md">
	<nav class="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
		<div class="flex-shrink-0">
			<a href="/">
				<h1 class="text-xl font-bold whitespace-nowrap text-blue-600 sm:text-2xl">foruca</h1>
			</a>
		</div>

		<div class="flex flex-grow justify-center px-4">
			<BoardSearcher />
		</div>

		<div class="flex-shrink-0">
			{#if !account}
				<Button
					onclick={async () => {
						await authClient.signIn.oauth2({
							providerId: "rebeccid",
						});
					}}
					color="blue"
					font="base">Login</Button
				>
			{:else}
				<!-- don't actually use GET /logout to logout or we'll have big pobem -->
				<form action="/" method="POST" use:enhance>
					<Button type="submit" color="blue" font="base">Logout e</Button>
				</form>
			{/if}
		</div>
	</nav>
</header>
