<script lang="ts">
	import { getFormattedDateTime } from "$lib";
	import type { PostListPost } from "$lib/types/bonus";

	let { post, showBoardName }: { post: PostListPost; showBoardName: boolean } = $props();
</script>

<li>
	<a href={`/boards/${post.boardName}/${post.id}`}>
		<div class="p-4 pb-2 transition duration-150 ease-in-out hover:bg-gray-50">
			<div class="mb-1 flex items-center justify-between">
				<p class="truncate text-lg font-semibold">
					{post.title}
				</p>
				<span class="text-xs text-gray-500">{getFormattedDateTime(post.createdAt)}</span>
			</div>
		</div>
	</a>
	<a href="heck">
		<div class="p-4 pt-2 transition duration-150 ease-in-out hover:bg-gray-50">
			<div class="text-sm text-gray-600">
				<span>
					by <span class="font-medium text-gray-700">{post.accountDisplayName}</span>
					{#if showBoardName}
						in <span class="font-medium text-gray-700">{post.boardName}</span>
					{/if}
				</span>
				<span class="mx-1 text-gray-300">|</span>
				<span>{post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}</span>
			</div>
		</div>
	</a>
</li>
