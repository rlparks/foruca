<script lang="ts">
	import { page } from "$app/state";
	import Header from "$lib/components/Header.svelte";
	import "../app.css";

	let { children, data } = $props();
</script>

<svelte:head>
	<title>foruca {page.data.pageTitle ? "· " + page.data.pageTitle : ""}</title>
	<meta name="description" content={page.data.pageDescription} />
</svelte:head>

<Header account={data.account} />

{@render children()}
