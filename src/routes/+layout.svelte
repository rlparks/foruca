<script lang="ts">
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

{@render children()}
