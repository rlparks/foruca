<script lang="ts">
	import type { PostListPost } from "$lib/types/bonus";
	import PostListItem from "./PostListItem.svelte";

	type Props = {
		posts: PostListPost[];
		showBoardName: boolean;
	};

	let { posts, showBoardName }: Props = $props();
</script>

<div class="rounded-lg outline">
	<ul class="divide-y divide-gray-200">
		{#each posts as post (post.id)}
			<li>
				<PostListItem {post} {showBoardName} />
			</li>
		{:else}
			<li class="p-4 text-center italic">No posts found.</li>
		{/each}
	</ul>
</div>
