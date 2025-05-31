import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";
import posthog from "posthog-js";
import type { LayoutLoad } from "./$types";

export const load = (async ({ data }) => {
	if (browser) {
		posthog.init(env.PUBLIC_POSTHOG_KEY, {
			api_host: "/ingest",
			ui_host: "https://us.posthog.com",
			capture_pageview: "history_change",
		});
	}

	return { ...data };
}) satisfies LayoutLoad;
