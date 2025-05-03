import { generateTextId } from "$lib/server";
import { sql } from "$lib/server/db/postgres";
import type { Account } from "$lib/types";

export const queries = {
	async createAccount(account: Omit<Account, "id">) {
		const id = generateTextId();

		const { username, displayName, isAdmin } = account;

		const [row] = await sql<Account[]>`INSERT INTO account (id, username, display_name, is_admin)
                                            VALUES (${id}, ${username}, ${displayName}, ${isAdmin})
                                            RETURNING id, username, display_name, is_admin;`;
		return row;
	},
};
