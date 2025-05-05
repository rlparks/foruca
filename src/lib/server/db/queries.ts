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
	async getAccountByUsername(username: string) {
		try {
			const [row] = await sql<Account[]>`SELECT id, username, display_name, is_admin
                                                FROM account
                                                WHERE username = ${username};`;
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
			expiresAt: Date;
			lastIp: string;
			userAgent: string;

			accountId: string;
			accountUsername: string;
			accountDisplayName: string;
			accountIsAdmin: boolean;
		};

		try {
			const [row] = await sql<TokenHashSelect[]>`
                                    SELECT session.id, account_id, expires_at, last_ip, user_agent,
                                    a.username AS accountUsername, a.display_name AS accountDisplayName,
                                    a.is_admin AS accountIsAdmin
                                    FROM session
                                    LEFT JOIN account a ON a.id = session.account_id
                                    WHERE token_hash = ${tokenHash};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	},

	async updateSessionById(
		sessionId: string,
		newFields: { lastActivityAt: Date; lastIp: string; userAgent: string; expiresAt: Date },
	) {
		try {
			const { lastActivityAt, lastIp, userAgent, expiresAt } = newFields;
			const [row] = await sql<Session[]>`UPDATE session
                                    SET last_activity_at = ${lastActivityAt}, last_ip = ${lastIp},
                                        user_agent = ${userAgent}, expires_at = ${expiresAt}
                                    WHERE id = ${sessionId}
                                    RETURNING id, account_id, created_at, last_activity_at, last_ip, user_agent, expires_at;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	},

	/**
	 * @throws on DB connection error
	 */
	async deleteSessionById(sessionId: string) {
		try {
			const [row] = await sql<{ id: string }[]>`DELETE FROM session WHERE id = ${sessionId}
                                    RETURNING id;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	},
};
