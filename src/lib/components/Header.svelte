<script lang="ts">
	import type { AuthModel } from "pocketbase";
	import type { PageData } from "../../routes/$types";
	import Title from "./Title.svelte";
	import { enhance } from "$app/forms";

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
			{#if user.avatarUrl}
				<img src={user.avatarUrl} alt={user.username + "'s avatar"} />
			{/if}
			<a class="nav-link" href="/"><p>{user.username}</p></a>
			<form action="/api/auth/logout" method="POST" use:enhance>
				<button type="submit" class="button">Logout</button>
			</form>
		{:else}
			<a class="nav-link" href="/login"> <div class="button">Login</div></a>
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

	p,
	form,
	button {
		margin: 0;
	}

	img {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}
</style>
