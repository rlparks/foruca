<script lang="ts">
	import Title from "./Title.svelte";
</script>

<header>
	<Title />
	<div></div>
	<div class="center-v">
		<a href="/"><p>name</p></a>
	</div>
</header>

<style>
	header {
		border-bottom: 1px solid var(--color-accent);

		display: flex;
		justify-content: space-between;
		height: var(--height-header);

		padding: 0 1rem;
	}
</style>
