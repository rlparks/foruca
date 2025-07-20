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

<PostList
	posts={data.posts}
	boardName={data.board.name}
	showBoardName={false}
	showCreatePost={true}
/>
