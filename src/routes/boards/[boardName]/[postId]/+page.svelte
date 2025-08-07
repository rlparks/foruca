<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import { slide } from "svelte/transition";

	let { data, form } = $props();

	const description =
		data.post.body.length > 100 ? `${data.post.body.slice(0, 100)}...` : data.post.body;

	let isReplying = $state(false);

	let formEl: HTMLFormElement | undefined = $state(undefined);
</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={`${data.post.boardName} · ${data.post.title}`} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
</svelte:head>

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
			<form
				bind:this={formEl}
				class="bg-gray-50 p-4 pt-3 dark:bg-gray-950"
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
				<TextArea
					name="body"
					rows={5}
					label="Reply"
					helpText={form?.message}
					onkeydown={(e) => {
						if (e.ctrlKey && e.key === "Enter") {
							formEl?.requestSubmit();
						}
					}}
					autofocus
				/>
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
