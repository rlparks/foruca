<script lang="ts">
	import HelpText from "$lib/components/HelpText.svelte";
	import MainColumns from "$lib/components/MainColumns.svelte";
	import PostList from "$lib/components/PostList.svelte";

	let { data } = $props();
</script>

<MainColumns>
	<HelpText>
		{#snippet title()}
			Welcome to <span class="text-blue-600">foruca</span>
		{/snippet}
		{#snippet body()}
			<span class="mb-2 block">The forum application that "works".</span>
			<span class="block">To get started, navigate to a board and make a post!</span>
		{/snippet}
	</HelpText>
	<PostList
		posts={data.posts}
		boardName="All Of Them"
		showBoardName={true}
		showCreatePost={false}
	/>
</MainColumns>
