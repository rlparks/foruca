<script lang="ts">
	import { page } from "$app/stores";
	import type { User } from "$lib/types";
	const { user }: { user: User } = $props();
</script>

{#if user}
	<div>
		<img src={$page.url.origin + `/api/images/user/${user.id}`} alt={user.username + "'s avatar"} />
		<p>{user.username}</p>
	</div>
{:else}
	<p style="color: red">‽</p>
{/if}

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* width: 50px; */
	}

	img {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}

	p {
		margin: 0;
	}
</style>
