<script lang="ts">
	import type { User } from "$lib/types";
	import AccountMenu from "./AccountMenu.svelte";

	type Props = {
		user: User | null;
	};

	let { user }: Props = $props();
</script>

<div class="h-full border-r p-4">
	<div class="flex h-full flex-col justify-between">
		<div class="space-y-4">
			<h1 class="w-full text-center text-2xl font-bold text-blue-600">
				<a href="/">foruca</a>
			</h1>
			<button class="w-full cursor-pointer rounded-md px-4 py-2 outline hover:bg-gray-900">
				Search
			</button>
			<p>e</p>
		</div>

		<AccountMenu {user} />
	</div>
</div>
