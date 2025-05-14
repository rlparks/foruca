<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import type { PostListPost } from "$lib/types/bonus";
	import PostListItem from "./PostListItem.svelte";

	type Props = {
		posts: PostListPost[];
		boardName: string;
		showBoardName: boolean;
		showCreatePost: boolean;
	};

	let { posts, boardName, showBoardName, showCreatePost }: Props = $props();
</script>

<main class="w-full md:w-3/4 lg:w-4/5">
	<div class="mb-4 flex min-h-10 items-center justify-between">
		<h2 class="justify-baseline text-xl font-semibold text-gray-800">Posts in {boardName}</h2>
		{#if showCreatePost}
			<Button href={`/boards/${boardName}/create`} color="green" font="base">Create Post</Button>
		{/if}
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow">
		<ul class="divide-y divide-gray-200">
			{#each posts as post (post.id)}
				<PostListItem {post} {showBoardName} />
			{:else}
				<li class="p-4 text-center text-gray-500">No posts found.</li>
			{/each}
		</ul>
	</div>
</main>
