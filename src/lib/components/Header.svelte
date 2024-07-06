<script lang="ts">
	import { page } from "$app/stores";
	import type { SafeUser } from "$lib/types";
	import LogoutButton from "./LogoutButton.svelte";
	import ThemeSwitcher from "./ThemeSwitcher.svelte";
	import Title from "./Title.svelte";

	const { user }: { user: SafeUser | undefined } = $props();
</script>

<header>
	<Title />
	<div class="center-v">
		<!-- {#if user} -->
		<a class="nav-link" href="/new"> <div class="button">+ New Post</div></a>
		<!-- {/if} -->
	</div>
	{@render account()}
</header>

{#snippet account()}
	<div id="container-account">
		<ThemeSwitcher />
		{#if user}
			{#if user.hasAvatar}
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
		margin-bottom: 1em;
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
