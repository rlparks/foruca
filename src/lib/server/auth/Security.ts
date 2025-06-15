import type { User } from "$lib/types";
import { error, type RequestEvent } from "@sveltejs/kit";

export default class Security {
	private readonly user: User | null;

	constructor(event: RequestEvent) {
		this.user = event.locals.user;
	}

	isAuthenticated() {
		return this.user !== null;
	}

	isAdmin() {
		return this.user?.role === "admin";
	}

	enforceAuthenticated() {
		if (!this.user) {
			return error(401, "Unauthorized");
		}

		return this;
	}

	enforceAdmin() {
		if (this.user?.role !== "admin") {
			return error(403, "Forbidden");
		}

		return this;
	}
}
