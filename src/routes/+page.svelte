<script lang="ts">
	import { PostHolder } from "$lib/components";
	import type { Post } from "$lib/types";

	const { data } = $props();
	// hope this is right?
	const posts: Post[] = $derived(data.posts);

	const startingPostNumber = $derived((data.page - 1) * data.perPage + 1);
	const endingPostNumber = $derived(
		data.totalItems < data.perPage ? data.totalItems : data.page * data.perPage
	);
</script>

<sveltekit:head>
	<title>foruca</title>
</sveltekit:head>

<div class="center-h">
	<div>
		{#each posts as post (post.id)}
			<PostHolder {post} />
		{/each}

		<p class="text-center">{`${startingPostNumber} - ${endingPostNumber} of ${data.totalItems}`}</p>
	</div>
</div>
