<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<kbd
	class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-1.5 py-1 text-[0.7rem] leading-none font-medium text-gray-800 shadow-sm [box-shadow:inset_0_-1px_0_rgba(0,0,0,0.05)] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
>
	{@render children()}
</kbd>
