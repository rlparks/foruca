<script lang="ts">
	let posts = [
		{
			id: 1,
			title: "post 1",
			body: "body 1"
		},
		{
			id: 2,
			title: "post 2",
			body: "<h1>body 2</h1>"
		}
	];
</script>

<div class="center-h">
	<div>
		{#each posts as post}
			<h2>{post.title}</h2>
			<p>{post.body}</p>
		{/each}
	</div>
</div>
