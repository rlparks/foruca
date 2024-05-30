<script lang="ts">
	import type { Post } from "$lib/types";
	import UserPortrait from "./UserPortrait.svelte";

	const { post }: { post: Post } = $props();
	// $effect(() => {
	// 	console.log("post:", post);
	// });

	const owner = $derived(post?.expand?.owner);

	const createdDate: Date = $derived(new Date(post.created));

	const niceDate = createdDate.toLocaleDateString();
	const niceTime = createdDate.toLocaleTimeString();
</script>

<div id="container">
	<div id="sidebar">
		<UserPortrait user={owner} />
		<p class="text-center">{niceDate}</p>
		<p class="text-center">{niceTime}</p>
	</div>
	<div class="vr"></div>
	<article>
		<h2>{post.title}</h2>
		<p>{post.body}</p>
	</article>
</div>

<style>
	#container {
		display: flex;
		justify-content: center;
		/* align-items: center; */
		border: 1px solid var(--color-accent);
		border-radius: 5px;
		padding: 1em;
	}
</style>
