<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { authClient } from "$lib/auth-client";
	import Button from "$lib/components/Button.svelte";
	import type { User } from "$lib/types";
	import type { AccountMenuLink } from "$lib/types/bonus";
	import { slide } from "svelte/transition";

	type Props = {
		user: User;
		accountLinks: AccountMenuLink[];
	};

	let { user, accountLinks }: Props = $props();

	const wrapperClass = "account-menu-wrapper";

	async function signOut() {
		await authClient.signOut();
		await invalidateAll();
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest(`.${wrapperClass}`)) {
			isOpen = false;
		}
	}

	let isOpen = $state(false);
</script>

<svelte:window onclick={handleClickOutside} />

<div class="{wrapperClass} relative">
	<Button color="outline" font="base" onclick={() => (isOpen = !isOpen)}>
		{user.name}
	</Button>

	{#if isOpen}
		<ul transition:slide class="absolute right-0 z-10 mt-2 w-30 rounded-md bg-white shadow-lg">
			{#each accountLinks as link (link.label + link.href)}
				<li>
					<a href={link.href} class="block px-4 py-2 hover:bg-gray-100">
						{link.label}
					</a>
				</li>
			{/each}
			<li>
				<button
					onclick={signOut}
					class="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
				>
					Sign Out
				</button>
			</li>
		</ul>
	{/if}
</div>
