<script lang="ts">
	import Title from "./Title.svelte";
</script>

<header>
	<Title />
	<div></div>
	<div class="center-v"></div>
	{@render account()}
</header>

{#snippet account()}
	<div id="container-account">
		<a class="nav-link" href="/"><p>name</p></a>
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
