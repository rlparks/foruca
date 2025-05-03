<script lang="ts">
	type Board = { id: number; name: string };

	let { boards, selectedBoard = $bindable() }: { boards: Board[]; selectedBoard: number | null } =
		$props();

	function selectBoard(boardId: number | null) {
		selectedBoard = boardId;
	}
</script>

<aside class="w-full md:w-1/4 lg:w-1/5">
	<div class="p-4">
		<h2 class="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Boards</h2>
		<ul class="space-y-2">
			<li>
				<button
					onclick={() => selectBoard(null)}
					class={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition duration-150 ease-in-out ${
						selectedBoard === null
							? 'bg-blue-100 font-bold text-blue-700'
							: 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
					}`}
				>
					All Posts
				</button>
			</li>
			{#each boards as board (board.id)}
				<li>
					<button
						onclick={() => selectBoard(board.id)}
						class={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition duration-150 ease-in-out ${
							selectedBoard === board.id
								? 'bg-blue-100 font-bold text-blue-700'
								: 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
						}`}
					>
						{board.name}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</aside>
