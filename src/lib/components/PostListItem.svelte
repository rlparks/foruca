<script lang="ts">
	import type { PostListPost } from "$lib/types/bonus";

	let { post, showBoardName }: { post: PostListPost; showBoardName: boolean } = $props();

	const isPostedToday = $derived.by(() => {
		const today = new Date();
		const postDate = new Date(post.createdAt);
		return (
			postDate.getDate() === today.getDate() &&
			postDate.getMonth() === today.getMonth() &&
			postDate.getFullYear() === today.getFullYear()
		);
	});

	const timeWord = $derived(isPostedToday ? "at" : "on");
	const time = $derived(
		isPostedToday
			? post.createdAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
			: post.createdAt.toLocaleDateString(),
	);

	const fullTime = $derived(
		post.createdAt.toLocaleString([], {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		}),
	);
</script>

<div>
	<a class="block p-4 dark:hover:bg-gray-900" href="/boards/{post.boardName}/{post.id}">
		{post.title}
	</a>
	<div class="flex flex-col *:flex-1 md:flex-row">
		<div class="flex *:flex-1">
			<a class="block truncate p-4 hover:bg-gray-800" href="/users/{post.userId}">
				by <span class="text-blue-600">{post.userName}</span>
			</a>
			{#if showBoardName}
				<a class="block truncate p-4 hover:bg-gray-800" href="/boards/{post.boardName}">
					in <span class="text-blue-600">{post.boardName}</span>
				</a>
			{/if}
		</div>
		<div class="flex *:flex-1">
			<p class="block truncate p-4" title={fullTime}>
				{timeWord} <span class="text-blue-600">{time}</span>
			</p>
			<p class="block p-4">
				<span class={post.replyCount > 0 ? "text-blue-600" : ""}>{post.replyCount}</span>
				{post.replyCount === 1 ? "reply" : "replies"}
			</p>
		</div>
	</div>
</div>
