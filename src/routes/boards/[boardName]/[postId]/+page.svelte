<script lang="ts">
	import { getFormattedDateTime } from "$lib";
	import Button from "$lib/components/Button.svelte";
	import { slide } from "svelte/transition";

	let { data } = $props();

	let isReplying = $state(false);
</script>

<svelte:head>
	<meta name="og:title" content={`${data.post.boardName} · ${data.post.title}`} />
</svelte:head>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 min-h-10">
		<div class="flex flex-col items-center justify-between md:flex-row">
			<div class="align-left w-full md:w-auto">
				<h2 class="justify-baseline text-lg font-semibold text-gray-800 md:text-xl">
					{data.post.title}
				</h2>
				<p class="text-gray-500">
					{data.post.accountDisplayName}
				</p>
			</div>
			<div class="w-full md:w-auto md:text-right">
				<p class="text-gray-500">
					{getFormattedDateTime(data.post.createdAt)}
				</p>
				<p class="text-gray-500">
					{data.post.replyCount}
					{data.post.replyCount === 1 ? "reply" : "replies"}
				</p>
			</div>
		</div>
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow">
		<p class="p-4">{data.post.body}</p>

		{#if isReplying}
			<form class="p-4" method="POST" transition:slide>
				<textarea
					name="body"
					placeholder="Write your reply..."
					class="w-full rounded border border-gray-300 p-2"
				></textarea>
				<Button color="blue" font="small" type="submit">Reply</Button>
				<Button color="outline" font="small" type="button" onclick={() => (isReplying = false)}>
					Cancel
				</Button>
			</form>
		{:else}
			<button
				onclick={() => (isReplying = true)}
				class="w-full cursor-pointer bg-gray-50 p-4 text-center transition hover:bg-gray-100"
			>
				Reply
			</button>
		{/if}
	</div>
</main>
