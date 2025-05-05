<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import "../app.css";

	let { children, data } = $props();
</script>

<Header account={data.account} authInfo={data.authInfo} />

{@render children()}
