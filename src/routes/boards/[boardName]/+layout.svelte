<script lang="ts">
	import HelpText from "$lib/components/HelpText.svelte";
	import MainColumns from "$lib/components/MainColumns.svelte";

	let { data, children } = $props();
</script>

<MainColumns>
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
</MainColumns>
