<script lang="ts">
	const textareaId = $props.id();

	type Props = {
		label: string;
		name: string;
		value?: string;
		helpText?: string;
		rows?: number;
		onkeydown?: (event: KeyboardEvent) => void;
	};

	let { label, name, value = $bindable(), helpText, rows = 3, onkeydown }: Props = $props();
</script>

<div class="mb-4">
	<label for={textareaId} class="mb-1.5 block text-sm font-medium">
		{label}
	</label>
	<textarea
		id={textareaId}
		{name}
		{rows}
		bind:value
		{onkeydown}
		class="mt-1 block min-h-15 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 sm:text-sm"
	></textarea>
	{#if helpText}
		<p class="mt-2 text-xs text-gray-500">{helpText}</p>
	{/if}
</div>
