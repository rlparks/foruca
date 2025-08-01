<script lang="ts">
	import PostList from "$lib/components/PostList.svelte";

	let { data } = $props();

	const title = data.board.name;
	const description =
		data.board.description || 'View this board on foruca, the forum application that "works".';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="og:title" content={title} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
</svelte:head>

<header class="mb-6 space-y-4">
	<h2 class="text-2xl font-bold">{data.board.name}</h2>

	<p>{data.board.description}</p>
</header>

<PostList posts={data.posts} showBoardName={false} />
