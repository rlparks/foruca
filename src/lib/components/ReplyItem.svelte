<script lang="ts">
	import Self from "./ReplyItem.svelte"; // self-import for recursion
	import { getFormattedDateTime } from "$lib";
	import type { ReplyTree } from "$lib/types/bonus";

	type Props = {
		reply: ReplyTree;
	};

	let { reply }: Props = $props();

	const createdAtDisplay = $derived(getFormattedDateTime(reply.createdAt));
	const fullTime = $derived(reply.createdAt.toLocaleString());
</script>

<li class="list-none">
	<article class="p-3">
		<header class="mb-1 flex items-center gap-2 text-xs text-gray-600">
			<a href="/users/{reply.userId}" class="font-medium text-blue-600">{reply.userName}</a>
			<span class="select-none">•</span>
			<time datetime={reply.createdAt.toISOString()} title={fullTime}>{createdAtDisplay}</time>
		</header>
		<div class="text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</div>
	</article>

	{#if reply.children?.length}
		<ul class="mt-3 space-y-3 border-l border-gray-300 pl-4 dark:border-gray-700">
			{#each reply.children as child}
				<Self reply={child} />
			{/each}
		</ul>
	{/if}
</li>
