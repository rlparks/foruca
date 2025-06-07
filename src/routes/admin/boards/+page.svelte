<script lang="ts">
	import { getFormattedDateTime } from "$lib";
	import Button from "$lib/components/Button.svelte";
	import HelpText from "$lib/components/HelpText.svelte";
	import MainColumns from "$lib/components/MainColumns.svelte";

	let { data } = $props();
</script>

<MainColumns>
	<HelpText>
		{#snippet title()}
			Manage Boards
		{/snippet}
		{#snippet body()}
			Create or update boards!
		{/snippet}
	</HelpText>
	<main class="w-full md:w-3/4 lg:w-4/5">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="justify-baseline text-xl font-semibold text-gray-800">All Boards</h2>
			<Button href="/admin/boards/create" color="green" font="base">Create Board</Button>
		</div>

		{#await data.boards then boards}
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<ul class="divide-y divide-gray-200">
					{#each boards as board (board.id)}
						<div>
							<a href={`/admin/boards/${board.id}`}>
								<li class="p-4 transition duration-150 ease-in-out hover:bg-gray-50">
									<div class="mb-1 flex items-center justify-between">
										<p class="text-lg font-semibold">
											{board.name}
										</p>
										<span class="text-xs text-gray-500">
											{getFormattedDateTime(board.createdAt)}
										</span>
									</div>
									<div class="text-sm text-gray-600">
										<span>
											{board.description}
										</span>
										<span class="mx-1 text-gray-300">|</span>
										<span>1 mikbillion posts</span>
									</div>
								</li>
							</a>
						</div>
					{:else}
						<li class="p-4 text-center text-gray-500">No boards found. Try creating one?</li>
					{/each}
				</ul>
			</div>
		{/await}
	</main>
</MainColumns>
