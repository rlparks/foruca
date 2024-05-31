<script lang="ts">
	import type { Post } from "$lib/types";
	import { PostHolder } from ".";

	const {
		posts,
		page,
		perPage,
		totalItems
	}: {
		posts: Post[];
		page: number;
		perPage: number;
		totalItems: number;
	} = $props();

	const startingPostNumber = $derived((page - 1) * perPage + 1);
	const endingPostNumber = $derived(startingPostNumber + posts.length - 1);
</script>

<div>
	{#each posts as post (post.id)}
		<PostHolder {post} />
	{/each}
	<div id="pagination">
		{#if page > 1 && posts.length > 0}
			<a class="nav-link" href="/?page={page - 1}"> <div class="button">{"<"}</div></a>
		{:else}
			<div class="page-button"></div>
		{/if}
		<div class="center-v">
			<p class="text-center">
				{`${startingPostNumber} - ${endingPostNumber} of ${totalItems}`}
			</p>
		</div>
		{#if endingPostNumber < totalItems && posts.length > 0}
			<a class="nav-link" href="/?page={page + 1}"> <div class="button">{">"}</div></a>
		{:else}
			<div class="page-button"></div>
		{/if}
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
