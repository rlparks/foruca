import type Security from "$lib/server/auth/Security";
import type { Queries } from "$lib/server/db/Queries";
import type { User } from "better-auth";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			queries: Queries;
			security: Security;
			user: User | null;
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
