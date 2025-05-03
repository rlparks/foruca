import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { Account, Session } from "$lib/types";

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

	/**
	 * @throws on DB connection error
	 */
	async createSession(session: Omit<Session, "id">, tokenHash: string, oidcIdToken: string) {
		const id = generateTextId();

		const { accountId, createdAt, lastActivityAt, lastIp, userAgent, expiresAt } = session;

		const sessionColumns = sql`
            id, account_id, token_hash, oidc_id_token, created_at, last_activity_at, last_ip, user_agent, expires_at
        `;

		try {
			await sql`INSERT INTO session (${sessionColumns})
                       VALUES (${id}, ${accountId}, ${tokenHash}, ${oidcIdToken}, ${createdAt}, ${lastActivityAt}, ${lastIp}, ${userAgent}, ${expiresAt});`;
		} catch (err) {
			throw parsePgError(err);
		}
	},

	/**
	 * @throws on DB connection error
	 */
	async getSessionByTokenHash(tokenHash: string) {
		type TokenHashSelect = {
			id: string;
			account_id: string;
			expires_at: Date;
		};

		try {
			const [row] = await sql<TokenHashSelect[]>`SELECT id, account_id, expires_at
                                    FROM session
                                    WHERE token_hash = ${tokenHash};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	},
};
