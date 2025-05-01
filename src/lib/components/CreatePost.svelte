<script>
	import { enhance } from '$app/forms';

	let boards = $state([
		{ id: 1, name: 'General Discussion' },
		{ id: 2, name: 'Tech Talk' },
		{ id: 3, name: 'Introductions' },
		{ id: 4, name: 'Off-Topic' },
		{ id: 5, name: 'Site Feedback' }
	]);

	let title = $state('');
	let selectedBoardId = $state(boards.length > 0 ? boards[0].id : '');
	let content = $state('');
</script>

<div class="min-h-screen bg-gray-100 p-4 font-sans sm:p-6 lg:p-8">
	<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md sm:p-8">
		<h1 class="mb-6 border-b pb-3 text-2xl font-bold text-gray-800 sm:text-3xl">Create New Post</h1>

		<form method="POST" class="space-y-6" use:enhance>
			<div>
				<label for="post-title" class="mb-1 block text-sm font-medium text-gray-700">
					Post Title
				</label>
				<input
					type="text"
					id="post-title"
					bind:value={title}
					required
					placeholder="m"
					class="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="board-select" class="mb-1 block text-sm font-medium text-gray-700">
					Select Board
				</label>
				<select
					id="board-select"
					bind:value={selectedBoardId}
					required
					class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500"
					disabled={boards.length === 0}
				>
					{#if boards.length === 0}
						<option value="" disabled>Loading boards...</option>
					{:else}
						<option value="" disabled selected>-- Select a board --</option>
						{#each boards as board (board.id)}
							<option value={board.id}>{board.name}</option>
						{/each}
					{/if}
				</select>
				{#if boards.length > 0 && !selectedBoardId}
					<p class="mt-1 text-xs text-red-500">Please select a board.</p>
				{/if}
			</div>

			<div>
				<label for="post-content" class="mb-1 block text-sm font-medium text-gray-700">
					Content
				</label>
				<textarea
					id="post-content"
					bind:value={content}
					required
					rows="8"
					placeholder="Write your post content here..."
					class="w-full resize-y rounded-md border border-gray-300 px-4 py-2 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500"
				></textarea>
			</div>

			<div class="mt-6 flex items-center justify-end gap-4 border-t pt-4">
				<button
					type="button"
					class="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={!title || !selectedBoardId || !content}
					class="rounded-md border border-transparent bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					Create Post
				</button>
			</div>
		</form>
	</div>
</div>
