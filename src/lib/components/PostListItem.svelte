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
			<span>{post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}</span>
		</div>
	</a>
	<div>
		<div class="flex flex-col text-sm text-gray-600 md:flex-row">
			<a
				href="/users/{post.userId}"
				class="w-full p-4 pt-1 transition duration-150 ease-in-out hover:bg-gray-50 md:w-1/4"
			>
				by <span class="font-medium text-gray-700">{post.userName}</span>
			</a>
			{#if showBoardName}
				<a
					href="/boards/{post.boardName}"
					class="w-full p-4 pt-1 transition duration-150 ease-in-out hover:bg-gray-50 md:w-3/4"
				>
					in <span class="font-medium text-gray-700">{post.boardName}</span>
				</a>
			{/if}
		</div>
	</div>
</li>
