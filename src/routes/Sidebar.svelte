<script lang="ts">
	import type { User } from "$lib/types";
	import AccountMenu from "./AccountMenu.svelte";

	type Props = {
		user: User | null;
	};

	let { user }: Props = $props();

	const searchWrapperClass = "search-wrapper";
	let showSearch = $state(false);
	let searchQuery = $state("");

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (showSearch && !target.closest(`.${searchWrapperClass}`)) {
			showSearch = false;
		}
	}
	function handleOverlayKeydown(event: KeyboardEvent) {
		if (showSearch && event.key === "Escape") {
			showSearch = false;
		}
	}
</script>

<svelte:window onkeydown={handleOverlayKeydown} />

<div class="h-full border-r p-4">
	<div class="flex h-full flex-col justify-between">
		<div class="space-y-4">
			<h1 class="w-full text-center text-2xl font-bold text-blue-600">
				<a href="/">foruca</a>
			</h1>
			<button
				class="w-full cursor-pointer rounded-md px-4 py-2 outline hover:bg-gray-900 {searchWrapperClass}"
				onclick={() => (showSearch = true)}
			>
				Search
			</button>
			<p>e</p>
		</div>

		<AccountMenu {user} />
	</div>

	{#if showSearch}
		<div
			class="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			onclick={handleClickOutside}
			onkeydown={handleOverlayKeydown}
		>
			<div
				class="relative flex h-[160px] w-[400px] items-center justify-center {searchWrapperClass}"
			>
				<div class="absolute flex w-full flex-col items-center rounded-xl bg-black p-6 shadow-lg">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search..."
						class="w-80 rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
