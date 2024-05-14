<script lang="ts">
	import type { AuthModel } from "pocketbase";
	import type { PageData } from "../../routes/$types";
	import Title from "./Title.svelte";

	const { user }: { user: AuthModel | undefined } = $props();
</script>

<header>
	<Title />
	<div></div>
	<div class="center-v"></div>
	{@render account()}
</header>

{#snippet account()}
	<div id="container-account">
		{#if user}
			<a class="nav-link" href="/"><p>{user.username}</p></a>
			<form action="/logout" method="POST">
				<button class="button">Logout</button>
			</form>
		{:else}
			<div id="container-log" class="button">
				<a class="nav-link" href="/login">Login</a>
			</div>
		{/if}
	</div>
{/snippet}

<style>
	header {
		border-bottom: 1px solid var(--color-accent);

		display: flex;
		justify-content: space-between;
		height: var(--height-header);

		padding: 0 1rem;
	}

	#container-account {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	#container-account > * {
		margin-left: 1rem;
	}

	#container-log a:hover {
		color: var(--color-text);
	}

	p,
	form,
	button {
		margin: 0;
	}
</style>
