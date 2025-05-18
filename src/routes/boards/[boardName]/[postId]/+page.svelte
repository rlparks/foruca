<script lang="ts">
	let { data } = $props();
</script>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 flex min-h-10 items-center justify-between">
		<h2 class="justify-baseline text-xl font-semibold text-gray-800">{data.post.title}</h2>
		e
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow">
		{data.post.body}
	</div>
</main>
