<script lang="ts">
	import { getFormattedDateTime } from "$lib";

	let { data } = $props();
</script>

<svelte:head>
	<meta name="og:title" content={`${data.post.boardName} · ${data.post.title}`} />
</svelte:head>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 min-h-10">
		<div class="flex items-center justify-between">
			<h2 class="justify-baseline text-xl font-semibold text-gray-800">{data.post.title}</h2>
			<p class="text-gray-500">
				{getFormattedDateTime(data.post.createdAt)}
			</p>
		</div>
		<div class="flex items-center justify-between">
			<p class="text-gray-500">
				{data.post.accountDisplayName}
			</p>
			<p class="text-gray-500">1 mikbillion replies</p>
		</div>
	</div>

	<div class="overflow-hidden rounded-lg bg-white p-4 shadow">
		{data.post.body}
	</div>
</main>
