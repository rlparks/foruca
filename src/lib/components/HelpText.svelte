<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		title: Snippet;
		body: Snippet;
	};

	let { title, body }: Props = $props();
</script>

<aside class="w-full md:w-1/4 lg:w-1/5">
	<h2 class="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">
		{@render title?.()}
	</h2>
	<p class="text-muted-foreground text-sm">
		{@render body?.()}
	</p>
</aside>
