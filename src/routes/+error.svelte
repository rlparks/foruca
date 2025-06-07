<script lang="ts">
	import { page } from "$app/state";
	import HelpText from "$lib/components/HelpText.svelte";
	import MainColumns from "$lib/components/MainColumns.svelte";
</script>

<MainColumns>
	<HelpText>
		{#snippet title()}
			Welcome to <span class="text-red-600">foruca</span>
		{/snippet}
		{#snippet body()}
			heck
		{/snippet}
	</HelpText>
	<main>
		<h2 class="mb-1 justify-baseline text-xl font-semibold text-gray-800">Error {page.status}</h2>
		{#if page.error?.message}
			<p class="text-gray-600">{page.error.message}</p>
		{/if}
	</main>
</MainColumns>
