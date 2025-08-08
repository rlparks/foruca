<script lang="ts">
	import ReplyItem from "$lib/components/ReplyItem.svelte";
	import type { PrettyReply, ReplyTree } from "$lib/types/bonus";

	type Props = {
		replies: PrettyReply[];
		canReply: boolean;
	};

	let { replies, canReply }: Props = $props();

	const roots = $derived.by(() => {
		// Sort replies once by createdAt descending
		const sortedReplies = replies.toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

		const map = new Map<string, ReplyTree>();
		const top: ReplyTree[] = [];
		for (const r of sortedReplies) {
			map.set(r.id, { ...r, children: [] });
		}

		for (const r of sortedReplies) {
			const node = map.get(r.id)!;
			if (r.parentId && map.has(r.parentId)) {
				map.get(r.parentId)!.children.push(node);
			} else {
				top.push(node);
			}
		}

		return top;
	});

	$effect(() => {
		if (roots.length === 0 && replies.length > 0) {
			alert("There exist replies, but there are no top level replies. ?");
		}
	});
</script>

<section class="mt-6">
	{#if replies.length === 0}
		<p class="p-4 text-sm text-gray-500">No replies yet.</p>
	{:else}
		<ul class="space-y-3">
			{#each roots as reply}
				<ReplyItem {reply} {canReply} />
			{/each}
		</ul>
	{/if}
</section>
