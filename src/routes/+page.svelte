<script lang="ts">
	import { goto } from "$app/navigation";
	import { PostPage } from "$lib/components";

	const { data } = $props();
	const { posts, page, perPage, totalItems } = $derived(data);

	$effect(() => {
		if (page !== 1 && posts.length === 0) {
			goto(`/?page=${page - 1}`);
		}
	});
</script>

<svelte:head>
	<title>foruca</title>
	<meta name="description" content="A classic form application." />
</svelte:head>

<div class="center-h">
	<PostPage {posts} {page} {perPage} {totalItems} />
</div>
