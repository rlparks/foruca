import type { SafeBoard } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
	const boards = (await (await fetch("/api/boards")).json()) as SafeBoard[];

	return { boards };
}) satisfies PageServerLoad;
