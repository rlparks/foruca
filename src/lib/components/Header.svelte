<script lang="ts">
	import type { PageData } from "../../routes/$types";
	import Title from "./Title.svelte";

	const { data }: { data: PageData } = $props();
</script>

<header>
	<Title />
	<div></div>
	<div class="center-v"></div>
	{@render account()}
</header>

{#snippet account()}
	<div id="container-account">
		{#if data?.user}
			<a class="nav-link" href="/"><p>{data.user.username}</p></a>
		{/if}
		<div id="container-log" class="button">
			<a class="nav-link" href="/login">Login</a>
		</div>
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
</style>
