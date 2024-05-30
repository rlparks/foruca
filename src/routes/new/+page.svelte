<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<h1 class="text-center">New Post</h1>

<div class="center-h">
	<form action="/api/posts" method="POST" use:enhance>
		<label>Title<input type="text" name="title" required /></label>
		<label>Body<textarea name="body" required></textarea></label>
		<button type="submit" class="button">Submit</button>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
	}

	textarea {
		width: 600px;
		height: 100px;
		min-width: 210px;
	}
</style>
