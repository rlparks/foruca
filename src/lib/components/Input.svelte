<script lang="ts">
	const inputId = $props.id();

	type Props = {
		label: string;
		name: string;
		value?: string;
		helpText?: string;
		type: "text" | "checkbox";
	};

	let { label, name, value = $bindable(), type, helpText }: Props = $props();
</script>

<div class="mb-4">
	{#if type !== "checkbox"}
		<label for={inputId} class="mb-1 block text-sm font-medium">
			{label}
		</label>
		<input
			id={inputId}
			{name}
			{type}
			bind:value
			class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 sm:text-sm"
		/>
	{:else}
		<div class="flex items-center">
			<input
				id={inputId}
				{name}
				{type}
				class="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
			/>
			<label for={inputId} class="ml-2 block text-sm text-gray-900">
				{label}
			</label>
		</div>
	{/if}
	{#if helpText}
		<p class="mt-2 text-xs">{helpText}</p>
	{/if}
</div>
