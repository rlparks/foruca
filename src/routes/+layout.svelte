<script lang="ts">
	import { dev } from "$app/environment";
	import { env } from "$env/dynamic/public";
	import "../app.css";
	import Sidebar from "./Sidebar.svelte";

	let { children, data } = $props();
</script>

<svelte:head>
	<!-- rybbit -->
	<script
		src="https://frog.rebeccaparks.com/api/script.js"
		data-site-id={env.PUBLIC_RYBBIT_ID}
		data-session-replay="true"
		data-web-vitals="true"
		data-track-errors="true"
		defer
	></script>
</svelte:head>

<div class="flex min-h-dvh">
	<div class="sticky top-0 hidden h-dvh w-[200px] flex-shrink-0 md:block">
		<Sidebar user={data.user} />
	</div>

	<div class="flex w-full justify-center px-8 py-6">
		<main class="w-full lg:w-[759px]">
			{@render children()}
		</main>
	</div>

	{#if dev}
		<div class="fixed right-0 bottom-0 rounded-tl-md bg-black/20 p-3 font-mono text-xl">
			> dev :)
		</div>
	{/if}
</div>
