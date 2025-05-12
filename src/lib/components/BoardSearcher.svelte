<script lang="ts">
	import Cancel from "$lib/components/icons/Cancel.svelte";
	import Search from "$lib/components/icons/Search.svelte";

	let boardSearchQuery = $state("");
</script>

<div class="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
	<input
		type="text"
		placeholder="Search boards..."
		bind:value={boardSearchQuery}
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
</div>
