<script lang="ts">
	import { enhance } from "$app/forms";

	const { data } = $props();
</script>

<h2 class="text-center">Login</h2>

<div class="center-h">
	<div>
		<form action="?/login" method="post" use:enhance>
			<label>Username<input type="text" name="username" /></label>
			<label>Password<input type="password" name="password" /></label>
			<button type="submit" class="button">Login</button>
		</form>
		<div class="center-h">
			<div id="container-oidc">
				{#each data.ssoProviders as provider}
					<button onclick={() => {}} class="button oidc">Login with {provider.displayName}</button>
				{/each}
			</div>
		</div>
	</div>
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

	#container-oidc {
		margin-top: 3rem;
		display: flex;
		flex-direction: column;
	}
</style>
