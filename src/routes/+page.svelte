<script lang="ts">
	import { goto } from "$app/navigation";
	import { PostHolder } from "$lib/components";
	import PostPage from "$lib/components/PostPage.svelte";
	import type { Post } from "$lib/types";

	const { data } = $props();
	const { posts, page, perPage, totalItems } = $derived(data);

	$effect(() => {
		if (posts.length === 0) {
			goto(`/?page=${page - 1}`);
		}
	});
</script>

<svelte:head>
	<title>foruca</title>
</svelte:head>

<div class="center-h">
	<PostPage {posts} {page} {perPage} {totalItems} />
</div>
