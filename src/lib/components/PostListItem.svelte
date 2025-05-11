<script lang="ts">
	import { getFormattedDateTime } from "$lib";
	import type { PostListPost } from "$lib/types/bonus";

	let { post }: { post: PostListPost } = $props();
</script>

<li class="p-4 transition duration-150 ease-in-out hover:bg-gray-50">
	<div class="mb-1 flex items-center justify-between">
		<a
			href={`/post/${post.id}`}
			class="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
		>
			{post.title}
		</a>
		<span class="text-xs text-gray-500">{getFormattedDateTime(post.createdAt)}</span>
	</div>
	<div class="text-sm text-gray-600">
		<span> by <span class="font-medium text-gray-700">{post.accountDisplayName}</span></span>
		<span class="mx-1 text-gray-300">|</span>
		<span>{post.replyCount} replies</span>
	</div>
</li>
