<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { authClient } from "$lib/auth-client";
	import type { User } from "$lib/types";

	const wrapperClass = "account-wrapper";

	type Props = {
		user: User | null;
	};

	let { user }: Props = $props();

	let isOpen = $state(false);

	function loginOidc() {
		authClient.signIn.oauth2({
			providerId: "rebeccid",
		});
	}

	function loginGithub() {
		authClient.signIn.social({
			provider: "github",
		});
	}

	function logout() {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					invalidateAll();
					isOpen = false;
				},
			},
		});
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest(`.${wrapperClass}`)) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="relative {wrapperClass}">
	{#if isOpen}
		<div class="absolute bottom-full mb-2 w-full rounded-lg outline">
			<ul>
				{#if !user}
					<li>
						<button
							class="w-full cursor-pointer rounded-lg px-4 py-2 outline dark:hover:bg-gray-900"
							onclick={loginOidc}
						>
							RebeccID
						</button>
					</li>
					<li>
						<button
							class="w-full cursor-pointer rounded-lg px-4 py-2 outline dark:hover:bg-gray-900"
							onclick={loginGithub}
						>
							GitHub
						</button>
					</li>
				{:else}
					<li>
						<button
							class="w-full cursor-pointer rounded-lg px-4 py-2 outline dark:hover:bg-gray-900"
							onclick={logout}
						>
							Logout
						</button>
					</li>
				{/if}
			</ul>
		</div>
	{/if}

	<button
		class="w-full cursor-pointer rounded-lg px-4 py-2 outline dark:hover:bg-gray-900"
		onclick={() => (isOpen = !isOpen)}
	>
		{#if !user}
			Login
		{:else}
			{user.name}
		{/if}
	</button>
</div>
