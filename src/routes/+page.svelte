<script lang="ts">
	import PostList from "$lib/components/PostList.svelte";

	const title = "foruca";
	const description = 'the forum application that "works"';

	let { data } = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="og:title" content={title} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
</svelte:head>

<header class="mb-6 space-y-4">
	<h2 class="text-2xl font-bold">Welcome to <span class="text-blue-600">foruca</span></h2>

	<p>The forum application that "works".</p>
</header>

<PostList posts={data.posts} showBoardName={true} />
