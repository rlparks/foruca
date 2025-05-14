<script lang="ts">
	import HelpText from "$lib/components/HelpText.svelte";
	import PostList from "$lib/components/PostList.svelte";

	let { data } = $props();
</script>

<div
	class="container mx-auto flex flex-col gap-6 px-4 py-5 sm:px-6 md:flex-row md:items-baseline lg:px-8"
>
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
</div>
