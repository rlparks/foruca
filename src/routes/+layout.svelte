<script lang="ts">
	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";
	import "./style.css";
	import { Header } from "$lib/components";
	import type { AuthModel } from "pocketbase";

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
</script>

<Header user={data.user} />

{@render children()}
