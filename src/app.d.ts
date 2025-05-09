import type { queries } from "$lib/server/db/queries";
import type { Account, Session } from "$lib/types";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			queries: typeof queries;
			account: Account | null;
			session: Session | null;
		}
		interface PageData {
			pageTitle: string;
			pageDescription: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
