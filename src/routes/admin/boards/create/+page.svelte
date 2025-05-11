<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import HelpText from "$lib/components/HelpText.svelte";
	import Input from "$lib/components/Input.svelte";

	let { data } = $props();
</script>

<div
	class="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-baseline lg:px-8"
>
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
			<Input label="Board Name" name="boardName" type="text" helpText="Limited to 50 characters." />

			<Input label="Board Description" name="boardDescription" type="text" />

			<Button type="submit" color="blue" font="small">Create Board</Button>
		</form>
	</div>
</div>
