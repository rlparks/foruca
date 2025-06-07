<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<div
	class="container mx-auto flex flex-col gap-6 px-4 py-5 sm:px-6 md:flex-row md:items-baseline lg:px-8"
>
	{@render children()}
</div>
