<script lang="ts">
	import HelpText from "$lib/components/HelpText.svelte";

	let { data, children } = $props();
</script>

<div
	class="container mx-auto flex flex-col gap-6 px-4 py-5 sm:px-6 md:flex-row md:items-baseline lg:px-8"
>
	<HelpText>
		{#snippet title()}
			<a href="/boards/{data.board.name}" class="text-blue-600 transition hover:text-blue-700">
				{data.board.name}
			</a>
		{/snippet}
		{#snippet body()}
			{data.board.description}
		{/snippet}
	</HelpText>
	{@render children()}
</div>
