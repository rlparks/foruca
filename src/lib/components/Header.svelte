<script lang="ts">
	import AccountMenu from "$lib/components/AccountMenu.svelte";
	import BoardSearcher from "$lib/components/BoardSearcher.svelte";
	import LoginButton from "$lib/components/LoginButton.svelte";
	import type { User } from "$lib/types";
	import type { AccountMenuLink } from "$lib/types/bonus";

	type Props = {
		user: User | null;
		accountLinks: AccountMenuLink[];
	};

	let { user, accountLinks }: Props = $props();
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
			{#if !user}
				<LoginButton />
			{:else}
				<AccountMenu {user} {accountLinks} />
			{/if}
		</div>
	</nav>
</header>
