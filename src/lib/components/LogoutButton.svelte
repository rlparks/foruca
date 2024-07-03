<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form
	action="/api/auth/logout"
	method="POST"
	use:enhance={() => {
		return async function ({ update }) {
			await update();
		};
	}}
>
	<button type="submit" class="button">Logout</button>
</form>

<style>
	form {
		margin-left: 1rem;
	}
</style>
