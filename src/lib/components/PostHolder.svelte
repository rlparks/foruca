<script lang="ts">
	import type { Post } from "$lib/types";
	import UserPortrait from "./UserPortrait.svelte";

	const { post }: { post: Post } = $props();
	$effect(() => {
		console.log("post:", post);
	});

	const owner = $derived(post?.expand?.owner);
</script>

<div id="container">
	<aside class="">
		<UserPortrait user={owner} />
	</aside>
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

	aside {
		height: 100%;
	}
</style>
