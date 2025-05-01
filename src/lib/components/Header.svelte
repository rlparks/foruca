<script lang="ts">
	let boardSearchQuery = $state('');
</script>

<header class="bg-white shadow-md">
	<nav class="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
		<div class="flex-shrink-0">
			<h1 class="text-xl font-bold whitespace-nowrap text-blue-600 sm:text-2xl">
				<a href="/">foruca</a>
			</h1>
		</div>

		<div class="flex flex-grow justify-center px-4">
			<div class="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
				<input
					type="text"
					placeholder="Search boards..."
					bind:value={boardSearchQuery}
					class="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 text-sm shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:ring-blue-500"
				/>
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg
						class="h-5 w-5 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				{#if boardSearchQuery}
					<button
						onclick={() => (boardSearchQuery = '')}
						type="button"
						class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
						aria-label="Clear search"
					>
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<div class="flex-shrink-0">
			<a
				href="/login"
				class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow transition duration-200 ease-in-out hover:bg-blue-600 hover:shadow-md sm:text-base"
			>
				Login
			</a>
		</div>
	</nav>
</header>
