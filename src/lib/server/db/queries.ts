import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { Account } from "$lib/types";

export const queries = {
	/**
	 * @throws if duplicate username
	 * @throws on DB connection error
	 */
	async createAccount(account: Omit<Account, "id">) {
		const id = generateTextId();

		const { username, displayName, isAdmin } = account;

		try {
			const [row] = await sql<Account[]>`INSERT INTO account (id, username, display_name, is_admin)
                                            VALUES (${id}, ${username}, ${displayName}, ${isAdmin})
                                            RETURNING id, username, display_name, is_admin;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	},
	/**
	 * @throws on DB connection error
	 */
	async getAccountById(id: string) {
		try {
			const [row] = await sql<Account[]>`SELECT id, username, display_name, is_admin
                                                FROM account
                                                WHERE id = ${id};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	},
};
