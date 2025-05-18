<script lang="ts">
	import { getFormattedDateTime } from "$lib";

	let { data } = $props();
</script>

<svelte:head>
	<meta name="og:title" content={`${data.post.boardName} · ${data.post.title}`} />
</svelte:head>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 min-h-10">
		<div class="flex flex-col items-center justify-between md:flex-row">
			<div class="align-left w-full">
				<h2 class="justify-baseline text-xl font-semibold text-gray-800">{data.post.title}</h2>
				<p class="text-gray-500">
					{data.post.accountDisplayName}
				</p>
			</div>
			<div class="w-full md:text-right">
				<p class="text-gray-500">
					{getFormattedDateTime(data.post.createdAt)}
				</p>
				<p class="text-gray-500">1 mikbillion replies</p>
			</div>
		</div>
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow">
		<p class="p-4">{data.post.body}</p>
		<button class="w-full cursor-pointer bg-gray-50 p-4 text-center transition hover:bg-gray-100">
			Reply
		</button>
	</div>
</main>
