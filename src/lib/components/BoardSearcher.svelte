<script lang="ts">
	import Cancel from "$lib/components/icons/Cancel.svelte";
	import Search from "$lib/components/icons/Search.svelte";
	import type { Board } from "$lib/types";

	let boardSearchQuery = $state("");
	let isFocused = $state(false);
	let foundBoards: Board[] = $state([]);

	async function searchBoards() {
		const response = await fetch(`/api/boards?q=${boardSearchQuery}`);
		if (response.ok) {
			foundBoards = (await response.json()) as Board[];
		} else {
			console.error("Failed to fetch boards");
		}
	}
</script>

<div class="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
	<input
		type="text"
		placeholder="Search boards..."
		bind:value={boardSearchQuery}
		onfocus={() => (isFocused = true)}
		onblur={() => setTimeout(() => (isFocused = false), 200)}
		oninput={() => searchBoards()}
		class="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 text-sm shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500"
	/>
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<Search />
	</div>
	{#if boardSearchQuery}
		<button
			onclick={() => (boardSearchQuery = "")}
			type="button"
			class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
			aria-label="Clear search"
		>
			<Cancel />
		</button>
	{/if}
	{#if foundBoards.length > 0 && isFocused}
		<ul
			class="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white py-1 text-sm shadow-lg"
		>
			{#each foundBoards as board (board.id)}
				<a href={`/boards/${board.name}`}>
					<li
						class="cursor-pointer px-4 py-2 hover:bg-gray-100"
						onclick={() => {
							boardSearchQuery = "";
							foundBoards = [];
						}}
						onkeydown={(e) => {
							if (e.key === "Enter") {
								boardSearchQuery = "";
								foundBoards = [];
							}
						}}
						role="option"
						tabindex="0"
						aria-selected="false"
					>
						{board.name}
					</li>
				</a>
			{/each}
		</ul>
	{/if}
</div>
