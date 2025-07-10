<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { authClient } from "$lib/auth-client";
	import Button from "$lib/components/Button.svelte";
	import type { User } from "$lib/types";
	import { slide } from "svelte/transition";

	type Props = {
		user: User;
	};

	let { user }: Props = $props();

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
