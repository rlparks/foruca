<script lang="ts">
	type Post = {
		id: number;
		title: string;
		author: string;
		board: string;
		replies: number;
		timestamp: string;
	};
	let { post }: { post: Post } = $props();
</script>

<li class="p-4 transition duration-150 ease-in-out hover:bg-gray-50">
	<div class="mb-1 flex items-center justify-between">
		<a
			href={`/post/${post.id}`}
			class="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
		>
			{post.title}
		</a>
		<span class="text-xs text-gray-500">{post.timestamp}</span>
	</div>
	<div class="text-sm text-gray-600">
		<span>
			by <span class="font-medium text-gray-700">{post.author}</span> in
			<span class="font-medium text-indigo-600">{post.board}</span></span
		>
		<span class="mx-2 text-gray-300">|</span>
		<span>{post.replies} replies</span>
	</div>
</li>
