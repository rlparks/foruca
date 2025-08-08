<script lang="ts">
	import Self from "./ReplyItem.svelte"; // self-import for recursion
	import { enhance } from "$app/forms";
	import { getFormattedDateTime } from "$lib";
	import Button from "$lib/components/Button.svelte";
	import Keycap from "$lib/components/Keycap.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import type { ReplyTree } from "$lib/types/bonus";
	import { slide } from "svelte/transition";

	type Props = {
		reply: ReplyTree;
		canReply: boolean;
	};

	let { reply, canReply }: Props = $props();

	const createdAtDisplay = $derived(getFormattedDateTime(reply.createdAt));
	const fullTime = $derived(reply.createdAt.toLocaleString());
	let isReplying = $state(false);
</script>

<li class="list-none">
	<article class="p-3">
		<header class="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
			<a href="/users/{reply.userId}" class="font-medium text-blue-600">{reply.userName}</a>
			<span class="select-none">•</span>
			<time datetime={reply.createdAt.toISOString()} title={fullTime}>{createdAtDisplay}</time>
			{#if canReply}
				<span class="select-none">•</span>
				<button
					type="button"
					class="cursor-pointer text-blue-600"
					onclick={() => (isReplying = !isReplying)}
				>
					{isReplying ? "Cancel" : "Reply"}
				</button>
			{/if}
		</header>
		<div class="text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</div>

		{#if canReply && isReplying}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<form
				transition:slide
				class="mt-2"
				method="POST"
				onkeydown={(e) => {
					if (e.key === "Escape") {
						e.preventDefault();
						isReplying = false;
					} else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
						e.currentTarget.requestSubmit();
					}
				}}
				use:enhance={() => {
					return async (form) => {
						if (form.result.type !== "failure") {
							isReplying = false;
						}
						await form.update();
					};
				}}
			>
				<input type="hidden" name="parentId" value={reply.id} />
				<div class="mb-2 flex items-center justify-between text-xs text-gray-500">
					<div class="space-x-2">
						<span>Submit</span>
						<Keycap>Ctrl</Keycap>
						<span>+</span>
						<Keycap>Enter</Keycap>
					</div>
					<div class="space-x-2">
						<span>Close</span>
						<Keycap>Esc</Keycap>
					</div>
				</div>
				<TextArea name="body" rows={4} label="Reply" autofocus />
				<div class="mt-2 flex gap-2">
					<Button color="blue" font="small" type="submit">Submit</Button>
					<Button color="outline" font="small" type="button" onclick={() => (isReplying = false)}>
						Cancel
					</Button>
				</div>
			</form>
		{/if}
	</article>

	{#if reply.children?.length}
		<ul class="mt-3 ml-2.5 space-y-3 border-l border-gray-300 pl-4 dark:border-gray-700">
			{#each reply.children as child}
				<Self reply={child} {canReply} />
			{/each}
		</ul>
	{/if}
</li>
