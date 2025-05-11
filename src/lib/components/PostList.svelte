<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import type { PostWithAccountAndReplyCount } from "$lib/types/bonus";
	import PostListItem from "./PostListItem.svelte";

	let { posts, boardName }: { posts: PostWithAccountAndReplyCount[]; boardName: string } = $props();
</script>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="justify-baseline text-xl font-semibold text-gray-800">Posts in {boardName}</h2>
		<Button href={`/boards/${boardName}/create`} color="green" font="base">Create Post</Button>
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
