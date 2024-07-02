<script lang="ts">
	import type { SafePost, SafeUser } from "$lib/types";
	import UserPortrait from "./UserPortrait.svelte";

	const { post }: { post: SafePost } = $props();

	const owner: SafeUser | null = $derived(post.owner);

	const createdDate: Date = $derived(new Date(post.created));

	const niceDate = $derived(createdDate.toLocaleDateString());
	const niceTime = $derived(createdDate.toLocaleTimeString());
</script>

<div id="container">
	<div id="sidebar">
		<UserPortrait user={owner} />
		<p class="text-center">{niceDate}</p>
		<p class="text-center">{niceTime}</p>
	</div>
	<div class="vr"></div>
	<div>
		<h2>{post.title}</h2>
		<p id="body">{post.body}</p>
	</div>
</div>

<style>
	#container {
		display: flex;
		/* justify-content: center; */
		/* align-items: center; */
		border: 1px solid var(--color-accent);
		border-radius: 5px;
		padding: 1em;
		width: 600px;
		margin-bottom: 1em;
	}

	h2 {
		margin-top: 0;
	}

	#body {
		white-space: pre-wrap;
	}
</style>
