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

		<Input label="Board Name" name="boardName" type="text" helpText="Limited to 50 characters." />

		<Input
			label="Board Description"
			name="boardDescription"
			type="text"
			helpText="Displays in the aside."
		/>

		<Input
			label="Private Board"
			name="privateBoard"
			type="checkbox"
			helpText="Posts will be visible only to logged-in users."
		/>

		<Button type="submit" color="blue" font="small">Create Post</Button>
	</form>
</div>
