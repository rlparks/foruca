<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import { slide } from "svelte/transition";

	let { data, form } = $props();

	const description = $derived(
		data.post.body.length > 100 ? `${data.post.body.slice(0, 100)}...` : data.post.body,
	);

	let isReplying = $state(false);

	// start replying with 'r'
	function onGlobalKeydown(e: KeyboardEvent) {
		if (e.defaultPrevented) return;
		if (isReplying) return;
		if (!data.user) return;
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const key = e.key?.toLowerCase();
		if (key !== "r") return;
		const target = e.target as HTMLElement | null;
		if (target && target.closest("input, textarea, select, [contenteditable='true']")) return;
		isReplying = true;
		e.preventDefault();
	}
</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={`${data.post.boardName} · ${data.post.title}`} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
</svelte:head>

<svelte:window onkeydown={onGlobalKeydown} />

<header class="mb-6 space-y-4">
	<h2 class="text-2xl font-bold">{data.post.title}</h2>

	<a href="/users/{data.post.userId}" class="text-blue-600">{data.post.userName}</a>
</header>

<div class="mb-6 rounded-lg outline">
	<p class="p-4">{data.post.body}</p>

	{#if data.user}
		{#if !isReplying}
			<button
				onclick={() => (isReplying = true)}
				class="w-full cursor-pointer bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900"
			>
				Reply
			</button>
		{:else}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- also accessible via buttons -->
			<form
				class="bg-gray-50 p-4 pt-3 dark:bg-gray-950"
				method="POST"
				transition:slide
				onkeydown={(e) => {
					if (e.key === "Escape") {
						e.preventDefault();
						isReplying = false;
					} else if (e.ctrlKey && e.key === "Enter") {
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
				<TextArea name="body" rows={5} label="Reply" helpText={form?.message} autofocus />
				<Button class="mb-2" color="blue" font="small" type="submit">Submit</Button>
				<Button color="outline" font="small" type="button" onclick={() => (isReplying = false)}>
					Cancel
				</Button>
			</form>
		{/if}
	{/if}
</div>

{#await data.replies}
	Loading replies...
{:then replies}
	<pre>{JSON.stringify(replies, null, 2)}</pre>
{/await}
