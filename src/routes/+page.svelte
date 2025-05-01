<script>
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

	let selectedBoard = $state(null);
</script>

<div class="min-h-screen">
	<div class="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
		<aside class="w-full md:w-1/4 lg:w-1/5">
			<div class="rounded-lg bg-white p-4 shadow">
				<h2 class="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">Boards</h2>
				<ul class="space-y-2">
					<li>
						<button
							class={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition duration-150 ease-in-out ${
								selectedBoard === null
									? 'bg-blue-100 font-bold text-blue-700'
									: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
							}`}
						>
							All Posts
						</button>
					</li>
					{#each boards as board (board.id)}
						<li>
							<button
								class={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition duration-150 ease-in-out ${
									false
										? 'bg-blue-100 font-bold text-blue-700'
										: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
								}`}
							>
								{board.name}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</aside>

		<main class="w-full md:w-3/4 lg:w-4/5">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-800">
					{'Board Name'}
				</h2>
				<a
					href="/create"
					class="rounded-lg bg-green-500 px-5 py-2 font-semibold text-white shadow transition duration-200 ease-in-out hover:bg-green-600 hover:shadow-md"
				>
					Create Post
				</a>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow">
				<ul class="divide-y divide-gray-200">
					{#each posts as post (post.id)}
						<li class="p-4 transition duration-150 ease-in-out hover:bg-gray-50">
							<div class="mb-1 flex items-center justify-between">
								<a
									href={`/post/${post.id}`}
									class="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
								>
									{post.title}
								</a>
								<span class="text-xs text-gray-500">{post.timestamp}</span>
							</div>
							<div class="text-sm text-gray-600">
								<span
									>by <span class="font-medium text-gray-700">{post.author}</span> in
									<span class="font-medium text-indigo-600">{post.board}</span></span
								>
								<span class="mx-2 text-gray-300">|</span>
								<span>{post.replies} replies</span>
							</div>
						</li>
					{:else}
						<li class="p-4 text-center text-gray-500">No posts found.</li>
					{/each}
				</ul>
			</div>
		</main>
	</div>
</div>
