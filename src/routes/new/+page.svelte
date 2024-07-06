<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import type { ActionData, PageData } from "./$types.js";

	type Props = {
		data: PageData;
		form: {
			error?: string;
		};
	};
	const { data, form }: Props = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>foruca · New Post</title>
	<meta name="description" content="Create a new post." />
</svelte:head>

<h1 class="text-center">New Post</h1>

{#if form?.error}
	<p class="text-center error">{form?.error}</p>
{/if}

<div class="center-h">
	<form
		action="/api/posts"
		method="POST"
		use:enhance={() => {
			loading = true;

			return async function ({ update, result }) {
				// this is weird due to the form action being in a separate
				// route in /api
				// https://github.com/sveltejs/kit/discussions/8015#discussioncomment-4349837
				await applyAction(result);
				await update();
				loading = false;
			};
		}}
	>
		<label>
			Board
			<select name="boardId">
				<option value="">Select Board</option>
				{#each data.boards as board (board.id)}
					<option value={board.id}>{board.name}</option>
				{/each}
			</select>
		</label>
		<label>Title<input type="text" name="title" required /></label>
		<label>Body<textarea name="body" required></textarea></label>
		<button type="submit" class="button" disabled={loading}>Submit</button>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
	}

	textarea {
		width: 600px;
		height: 100px;
		min-width: 210px;
	}
</style>
