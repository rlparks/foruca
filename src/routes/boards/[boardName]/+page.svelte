<script lang="ts">
	import PostList from "$lib/components/PostList.svelte";

	let { data } = $props();

	let posts = $state([
		{
			id: 101,
			title: "Welcome to the Forum!",
			author: "Admin",
			board: "General Discussion",
			replies: 5,
			timestamp: "2h ago",
		},
		{
			id: 102,
			title: "Latest Svelte 5 Features",
			author: "TechGuru",
			board: "Tech Talk",
			replies: 12,
			timestamp: "5h ago",
		},
		{
			id: 103,
			title: "Introduce Yourself Here",
			author: "CommunityBot",
			board: "Introductions",
			replies: 25,
			timestamp: "1d ago",
		},
		{
			id: 104,
			title: "Favorite Weekend Hobbies?",
			author: "CasualUser",
			board: "Off-Topic",
			replies: 8,
			timestamp: "2d ago",
		},
		{
			id: 105,
			title: "How can we improve the forum?",
			author: "Admin",
			board: "Site Feedback",
			replies: 3,
			timestamp: "3d ago",
		},
	]);
</script>

<PostList {posts} boardName={data.board.name} />
