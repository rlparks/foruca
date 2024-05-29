<script lang="ts">
	import { Header } from "$lib/components";
	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";
	import "./style.css";

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
	let user = $derived(data.user);
</script>

<Header {user} />

{@render children()}
