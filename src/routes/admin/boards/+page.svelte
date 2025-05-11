<script lang="ts">
	import HelpText from "$lib/components/HelpText.svelte";

	let { data } = $props();
</script>

<div
	class="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-baseline lg:px-8"
>
	<HelpText>
		{#snippet title()}
			Manage Boards
		{/snippet}
		{#snippet body()}
			Create or update boards!
		{/snippet}
	</HelpText>
	<div>
		{#await data.boards}
			<p>Loading boards...</p>
		{:then boards}
			{#each boards as board (board.id)}
				<div>
					<h2>{board.name}</h2>
					<p>{board.description}</p>
					<p>Created at: {board.createdAt}</p>
					<p>Public: {board.isPublic}</p>
				</div>
			{/each}
		{/await}
	</div>
</div>
