<script lang="ts">
	import { dev } from "$app/environment";
	import Header from "$lib/components/Header.svelte";
	import "../app.css";

	let { children, data } = $props();
</script>

<Header user={data.user} accountLinks={data.accountLinks} />
{#if dev}
	<div class="fixed right-0 bottom-0 rounded-tl-md bg-black/20 p-3 font-mono text-xl">> dev :)</div>
{/if}

{@render children()}
