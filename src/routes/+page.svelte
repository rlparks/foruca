<script lang="ts">
	import type { Post } from "$lib/types";

	const { data } = $props();
	// hope this is right?
	const posts: Post[] = $derived(data.posts);
</script>

<sveltekit:head>
	<title>foruca</title>
</sveltekit:head>

<div class="center-h">
	<div>
		{#each posts as post (post.id)}
			<h2>{post.title}</h2>
			<p>{post.body}</p>
		{/each}
	</div>
</div>
