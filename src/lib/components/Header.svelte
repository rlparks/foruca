<script lang="ts">
	import { page } from "$app/stores";
	import type { AuthModel } from "pocketbase";
	import LogoutButton from "./LogoutButton.svelte";
	import Title from "./Title.svelte";

	const { user }: { user: AuthModel | undefined } = $props();
	$effect(() => {
		console.log("user:", user);
	});
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
			{#if user.avatar}
				<img
					src={$page.url.origin + `/api/images/user/${user.id}`}
					alt={user.username + "'s avatar"}
				/>
			{/if}
			<a class="nav-link" href="/"><p>{user.username}</p></a>
			<LogoutButton />
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

	p {
		margin: 0;
	}

	img {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}
</style>
