<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import Button from "$lib/components/Button.svelte";
	import { slide } from "svelte/transition";

	const wrapperClass = "login-wrapper";

	async function signInOidc() {
		await authClient.signIn.oauth2({
			providerId: "rebeccid",
		});
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
	<Button onclick={() => (isOpen = !isOpen)} color="blue" font="base">Login</Button>

	{#if isOpen}
		<ul transition:slide class="absolute right-0 z-10 mt-2 w-30 rounded-md bg-white shadow-lg">
			<li>
				<button
					onclick={signInOidc}
					class="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
				>
					RebeccID
				</button>
			</li>
		</ul>
	{/if}
</div>
