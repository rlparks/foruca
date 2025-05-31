<script lang="ts">
	import { page } from "$app/state";
	import { env } from "$env/dynamic/public";
	import Header from "$lib/components/Header.svelte";
	import posthog from "posthog-js";
	import "../app.css";

	let { children, data } = $props();

	$effect(() => {
		posthog.init(env.PUBLIC_POSTHOG_KEY, {
			api_host: "/ingest",
			ui_host: "https://us.posthog.com",
			person_profiles: "identified_only",
		});
	});
</script>

<svelte:head>
	<title>{page.data.pageTitle}</title>
	<meta name="og:title" content={page.data.pageTitle} />
	<meta name="description" content={page.data.pageDescription} />
	<meta name="og:description" content={page.data.pageDescription} />
</svelte:head>

<Header account={data.account} />

{@render children()}
