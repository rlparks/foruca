import type { Account } from "$lib/types";
import { error, type RequestEvent } from "@sveltejs/kit";

export default class Security {
	private readonly account: Account | null;

	constructor(event: RequestEvent) {
		this.account = event.locals.account;
	}

	isAuthenticated() {
		return this.account !== null;
	}

	isAdmin() {
		return this.account?.isAdmin ?? false;
	}

	enforceAuthenticated() {
		if (!this.account) {
			return error(401, "Unauthorized");
		}

		return this;
	}

	enforceAdmin() {
		if (!this.account?.isAdmin) {
			return error(403, "Forbidden");
		}

		return this;
	}
}
