<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";

	let { data, form } = $props();
</script>

<div class="flex w-full justify-center">
	<form method="POST" use:enhance>
		{#if form?.message}
			<p class="mb-4 text-red-500">{form.message}</p>
		{/if}

		<Input label="Post Title" name="postTitle" type="text" />

		<Input label="Post Content" name="postBody" type="text" />

		<Button type="submit" color="blue" font="small">Create Post</Button>
	</form>
</div>
