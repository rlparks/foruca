import { getAuthProviderInfo } from "$lib/server/auth";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	const authInfo = await getAuthProviderInfo();
	const { account } = event.locals;

	return { authInfo, account };
}) satisfies LayoutServerLoad;
