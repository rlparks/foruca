<script lang="ts">
	import { enhance } from "$app/forms";
	import { getFormattedDateTime } from "$lib";
	import Button from "$lib/components/Button.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import { slide } from "svelte/transition";

	let { data, form } = $props();

	const description =
		data.post.body.length > 100 ? `${data.post.body.slice(0, 100)}...` : data.post.body;

	let isReplying = $state(false);
</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={`${data.post.boardName} · ${data.post.title}`} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
</svelte:head>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 min-h-10">
		<div class="flex flex-col items-center justify-between md:flex-row">
			<div class="align-left w-full md:w-auto">
				<h2 class="justify-baseline text-lg font-semibold text-gray-800 md:text-xl">
					{data.post.title}
				</h2>
				<p class="text-gray-500">
					{data.post.userName}
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

	<div class="mb-4 overflow-hidden rounded-lg bg-white shadow">
		<p class="p-4">{data.post.body}</p>

		{#if isReplying}
			<form
				class="bg-gray-50 p-4 pt-3"
				method="POST"
				transition:slide
				use:enhance={() => {
					return async (form) => {
						if (form.result.type !== "failure") {
							isReplying = false;
						}
						await form.update();
					};
				}}
			>
				<TextArea name="body" rows={5} label="Reply" helpText={form?.message} />
				<Button color="blue" font="small" type="submit">Submit</Button>
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

	{#await data.replies}
		Loading replies...
	{:then replies}
		<pre>{JSON.stringify(replies, null, 2)}</pre>
	{/await}
</main>
