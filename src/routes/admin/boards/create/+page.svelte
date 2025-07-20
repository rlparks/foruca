<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import HelpText from "$lib/components/HelpText.svelte";
	import Input from "$lib/components/Input.svelte";
	import MainColumns from "$lib/components/MainColumns.svelte";

	let { form } = $props();
	const title = "Create Board";
	const description = "foruca admin: create a new board";
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="og:title" content={title} />
	<meta name="og:description" content={description} />
</svelte:head>

<MainColumns>
	<HelpText>
		{#snippet title()}
			Create Board
		{/snippet}
		{#snippet body()}
			Create a new board for very important posts.
		{/snippet}
	</HelpText>
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

			<Button type="submit" color="blue" font="small">Create Board</Button>
		</form>
	</div>
</MainColumns>
