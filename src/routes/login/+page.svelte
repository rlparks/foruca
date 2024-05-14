<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
</script>

<h2 class="text-center">Login</h2>

<div class="center-h">
	<form action="?/login" method="post" use:enhance>
		<label>Username<input type="text" name="username" /></label>
		<label>Password<input type="password" name="password" /></label>
		<button type="submit" class="button">Login</button>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
	}

	input {
		margin: 0.5rem 0;
		padding: 0.5rem;
		border-radius: 5px;
	}

	button {
		margin: 0.5rem 0;
		padding: 0.5rem;
	}
</style>
