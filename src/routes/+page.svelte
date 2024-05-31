<script lang="ts">
	import { goto } from "$app/navigation";
	import { PostHolder } from "$lib/components";
	import type { Post } from "$lib/types";

	const { data } = $props();
	// hope this is right?
	const posts: Post[] = $derived(data.posts);

	const startingPostNumber = $derived((data.page - 1) * data.perPage + 1);
	const endingPostNumber = $derived(startingPostNumber + posts.length - 1);

	$effect(() => {
		if (posts.length === 0) {
			goto(`/?page=${data.page - 1}`);
		}
	});
</script>

<svelte:head>
	<title>foruca</title>
</svelte:head>

<div class="center-h">
	<div>
		{#each posts as post (post.id)}
			<PostHolder {post} />
		{/each}
		<div id="pagination">
			{#if data.page > 1}
				<a class="nav-link" href="/?page={data.page - 1}"> <div class="button">{"<"}</div></a>
			{:else}
				<div class="page-button"></div>
			{/if}
			<div class="center-v">
				<p class="text-center">
					{`${startingPostNumber} - ${endingPostNumber} of ${data.totalItems}`}
				</p>
			</div>
			{#if endingPostNumber < data.totalItems}
				<a class="nav-link" href="/?page={data.page + 1}"> <div class="button">{">"}</div></a>
			{:else}
				<div class="page-button"></div>
			{/if}
		</div>
	</div>
</div>

<style>
	p {
		display: inline;
		margin: 0;
	}

	#pagination {
		display: flex;
		justify-content: space-between;
	}

	.page-button {
		width: 39px;
	}
</style>
