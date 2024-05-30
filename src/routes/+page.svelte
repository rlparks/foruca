<script lang="ts">
	import { PostHolder } from "$lib/components";
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
			<PostHolder {post} />
		{/each}
	</div>
</div>
