<script lang="ts">
	import PostList from "$lib/components/PostList.svelte";

	let { data } = $props();
</script>

<PostList posts={data.posts} boardName={data.board.name} showBoardName={false} />
