import { error, type RequestEvent } from "@sveltejs/kit";
import type { User } from "better-auth";

export default class Security {
	private readonly user: User | null;

	constructor(event: RequestEvent) {
		this.user = event.locals.user;
	}

	isAuthenticated() {
		return this.user !== null;
	}

	isAdmin() {
		return this.user?.isAdmin ?? false;
	}

	enforceAuthenticated() {
		if (!this.user) {
			return error(401, "Unauthorized");
		}

		return this;
	}

	enforceAdmin() {
		if (!this.user?.isAdmin) {
			return error(403, "Forbidden");
		}

		return this;
	}
}
