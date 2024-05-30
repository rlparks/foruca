<script lang="ts">
	import { page } from "$app/stores";
</script>

<svelte:head>
	<title>foruca · Error {$page.status}</title>
</svelte:head>

<h1 class="text-center">{$page.status}: {$page.error?.message}</h1>
<div class="center-h">
	<a class="nav-link" href="/"> <div class="button">Home</div></a>
</div>
