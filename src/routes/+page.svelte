<script lang="ts">
	import BoardList from '$lib/components/BoardList.svelte';
	import PostList from '$lib/components/PostList.svelte';

	let boards = $state([
		{ id: 1, name: 'General Discussion' },
		{ id: 2, name: 'Tech Talk' },
		{ id: 3, name: 'Introductions' },
		{ id: 4, name: 'Off-Topic' },
		{ id: 5, name: 'Site Feedback' }
	]);

	let posts = $state([
		{
			id: 101,
			title: 'Welcome to the Forum!',
			author: 'Admin',
			board: 'General Discussion',
			replies: 5,
			timestamp: '2h ago'
		},
		{
			id: 102,
			title: 'Latest Svelte 5 Features',
			author: 'TechGuru',
			board: 'Tech Talk',
			replies: 12,
			timestamp: '5h ago'
		},
		{
			id: 103,
			title: 'Introduce Yourself Here',
			author: 'CommunityBot',
			board: 'Introductions',
			replies: 25,
			timestamp: '1d ago'
		},
		{
			id: 104,
			title: 'Favorite Weekend Hobbies?',
			author: 'CasualUser',
			board: 'Off-Topic',
			replies: 8,
			timestamp: '2d ago'
		},
		{
			id: 105,
			title: 'How can we improve the forum?',
			author: 'Admin',
			board: 'Site Feedback',
			replies: 3,
			timestamp: '3d ago'
		}
	]);

	let selectedBoardId = $state<number | null>(null);
</script>

<div class="min-h-screen">
	<div class="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
		<BoardList bind:selectedBoard={selectedBoardId} {boards} />
		<PostList {posts} boardName="Board Name" />
	</div>
</div>
