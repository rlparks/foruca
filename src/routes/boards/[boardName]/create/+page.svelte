<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import TextArea from "$lib/components/TextArea.svelte";

	let { data, form } = $props();
	const title = `Create Post · ${data.board.name}`;
	const description = `Create a new post in ${data.board.name}.`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="og:title" content={title} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
</svelte:head>

<div class="flex w-full justify-center">
	<form method="POST" use:enhance>
		{#if form?.message}
			<p class="mb-4 text-red-500">{form.message}</p>
		{/if}

		<Input label="Post Title" name="postTitle" type="text" />

		<TextArea label="Post Content" name="postBody" rows={10} />

		<Button type="submit" color="blue" font="small">Create Post</Button>
	</form>
</div>
