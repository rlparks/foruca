<script lang="ts">
	import { dev } from "$app/environment";
	import { page } from "$app/state";
	import Header from "$lib/components/Header.svelte";
	import "../app.css";

	let { children, data } = $props();
</script>

<svelte:head>
	<title>{page.data.pageTitle}</title>
	<meta name="og:title" content={page.data.pageTitle} />
	<meta name="description" content={page.data.pageDescription} />
	<meta name="og:description" content={page.data.pageDescription} />
</svelte:head>

<Header user={data.user} accountLinks={data.accountLinks} />
{#if dev}
	<div class="fixed right-0 bottom-0 rounded-tl-md bg-black/20 p-3 font-mono text-xl">> dev :)</div>
{/if}

{@render children()}
