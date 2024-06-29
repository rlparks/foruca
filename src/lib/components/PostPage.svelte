<script lang="ts">
	import { DEFAULT_PER_PAGE } from "$lib";
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
	const perPageParam = $derived(perPage === DEFAULT_PER_PAGE ? "" : `&perPage=${perPage}`);
</script>

<div>
	{#if posts.length > 0}
		{#each posts as post (post.id)}
			<PostHolder {post} />
		{/each}
		<div id="pagination">
			{#if page > 1 && posts.length > 0}
				<a class="nav-link" href="/?page={page - 1}{perPageParam}">
					<div class="button">{"<"}</div></a
				>
			{:else}
				<div class="page-button"></div>
			{/if}
			<div class="center-v">
				<p class="text-center">
					{`${startingPostNumber} - ${endingPostNumber} of ${totalItems}`}
				</p>
			</div>
			{#if endingPostNumber < totalItems && posts.length > 0}
				<a class="nav-link" href="/?page={page + 1}{perPageParam}">
					<div class="button">{">"}</div></a
				>
			{:else}
				<div class="page-button"></div>
			{/if}
		</div>
	{:else}
		<p id="no-posts" class="text-center">No posts found. Try <a href="/new">creating one</a>!</p>
	{/if}
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

	#no-posts {
		margin-bottom: 3em;
	}
</style>
