<script lang="ts">
	import HelpText from "$lib/components/HelpText.svelte";
	import PostList from "$lib/components/PostList.svelte";
</script>

<div
	class="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-baseline lg:px-8"
>
	<HelpText>
		{#snippet title()}
			Welcome to <span class="text-blue-600">foruca</span>
		{/snippet}
		{#snippet body()}
			The forum application that "works".
		{/snippet}
	</HelpText>
	<PostList posts={[]} boardName="All Posts" />
</div>
