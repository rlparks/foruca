<script lang="ts">
	import { page } from "$app/state";
</script>

<h2 class="mb-2 text-2xl font-bold">Error {page.status}</h2>
{#if page.error?.message}
	<p class="text-sm">{page.error.message}</p>
{/if}
