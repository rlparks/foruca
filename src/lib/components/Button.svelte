<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		color: "blue" | "green" | "red" | "outline";
		font: "base" | "small";
		href?: string;
		type?: "button" | "submit"; // undefined if a
		onclick?: (event: MouseEvent) => void;
		class?: string;
		disabled?: boolean;
		children: Snippet;
	};

	let {
		color = "blue",
		font,
		href,
		type = "button",
		onclick,
		class: additionalClasses = "",
		disabled = false,
		children,
	}: Props = $props();

	const colorStyles = {
		blue: "bg-blue-500 hover:bg-blue-600 text-white",
		green: "bg-green-500 hover:bg-green-600 text-white",
		red: "bg-red-500 hover:bg-red-600 text-white",
		outline: "outline text-gray-700 hover:bg-gray-50",
	};

	const baseStyles =
		"cursor-pointer rounded-md px-4 py-2 text-sm font-medium shadow \
        transition duration-200 ease-in-out \
        hover:shadow-md \
        disabled:cursor-not-allowed disabled:opacity-50 \
        focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none";

	const fontStyle = {
		base: "sm:text-base",
		small: "",
	};

	let combinedClasses = $derived(
		`${baseStyles} ${colorStyles[color]} ${fontStyle[font]} ${additionalClasses}`,
	);
</script>

{#if href}
	<a {href} class={combinedClasses} {onclick} role="button">
		{@render children?.()}
	</a>
{:else}
	<button {type} class={combinedClasses} {onclick} {disabled}>
		{@render children?.()}
	</button>
{/if}
