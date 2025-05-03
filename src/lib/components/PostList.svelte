<script lang="ts">
	import PostListItem from './PostListItem.svelte';

	type Post = {
		id: number;
		title: string;
		author: string;
		board: string;
		replies: number;
		timestamp: string;
	};

	let { posts, boardName }: { posts: Post[]; boardName: string } = $props();
</script>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="justify-baseline text-xl font-semibold text-gray-800">{boardName}</h2>
		<a
			href="/create"
			class="rounded-lg bg-green-500 px-5 py-2 font-semibold text-white shadow transition duration-200 ease-in-out hover:bg-green-600 hover:shadow-md"
		>
			Create Post
		</a>
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow">
		<ul class="divide-y divide-gray-200">
			{#each posts as post (post.id)}
				<PostListItem {post} />
			{:else}
				<li class="p-4 text-center text-gray-500">No posts found.</li>
			{/each}
		</ul>
	</div>
</main>
