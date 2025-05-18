import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import type { Account, Board, Post, Session } from "$lib/types";
import type { PostListPost } from "$lib/types/bonus";
import postgres from "postgres";

export class Queries {
	private readonly sql: postgres.Sql;
	constructor(sql: postgres.Sql) {
		this.sql = sql;
	}
	/**
	 * @throws if duplicate username
	 * @throws on DB connection error
	 */
	async createAccount(account: Omit<Account, "id">) {
		const id = generateTextId();

		const { username, displayName, isAdmin } = account;

		try {
			const [row] = await this.sql<
				Account[]
			>`INSERT INTO account (id, username, display_name, is_admin)
                                            VALUES (${id}, ${username}, ${displayName}, ${isAdmin})
                                            RETURNING id, username, display_name, is_admin;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}
	/**
	 * @throws on DB connection error
	 */
	async getAccountById(id: string) {
		try {
			const [row] = await this.sql<Account[]>`SELECT id, username, display_name, is_admin
                                                FROM account
                                                WHERE id = ${id};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async getAccountByUsername(username: string) {
		try {
			const [row] = await this.sql<Account[]>`SELECT id, username, display_name, is_admin
                                                FROM account
                                                WHERE username = ${username};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async createSession(session: Omit<Session, "id">, tokenHash: string, oidcIdToken: string) {
		const id = generateTextId();

		const { accountId, createdAt, lastActivityAt, lastIp, userAgent, expiresAt } = session;

		const sessionColumns = this.sql`
            id, account_id, token_hash, oidc_id_token, created_at, last_activity_at, last_ip, user_agent, expires_at
        `;

		try {
			await this.sql`INSERT INTO session (${sessionColumns})
                       VALUES (${id}, ${accountId}, ${tokenHash}, ${oidcIdToken}, ${createdAt}, ${lastActivityAt}, ${lastIp}, ${userAgent}, ${expiresAt});`;
		} catch (err) {
			throw parsePgError(err);
		}
	}

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
			const [row] = await this.sql<TokenHashSelect[]>`
                                    SELECT session.id, account_id, expires_at, last_ip, user_agent,
                                    a.username AS account_username, a.display_name AS account_display_name,
                                    a.is_admin AS account_is_admin
                                    FROM session
                                    LEFT JOIN account a ON a.id = session.account_id
                                    WHERE token_hash = ${tokenHash};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * Useful for logout
	 * @throws on DB connection error
	 */
	async getOidcIdTokenBySessionId(sessionId: string) {
		type OidcIdTokenSelect = {
			id: string;
			oidcIdToken: string;
		};

		try {
			const [row] = await this.sql<OidcIdTokenSelect[]>`
                                    SELECT id, oidc_id_token
                                    FROM session
                                    WHERE id = ${sessionId};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	async updateSessionById(
		sessionId: string,
		newFields: { lastActivityAt: Date; lastIp: string; userAgent: string; expiresAt: Date },
	) {
		try {
			const { lastActivityAt, lastIp, userAgent, expiresAt } = newFields;
			const [row] = await this.sql<Session[]>`UPDATE session
                                    SET last_activity_at = ${lastActivityAt}, last_ip = ${lastIp},
                                        user_agent = ${userAgent}, expires_at = ${expiresAt}
                                    WHERE id = ${sessionId}
                                    RETURNING id, account_id, created_at, last_activity_at, last_ip, user_agent, expires_at;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async deleteSessionById(sessionId: string) {
		try {
			const [row] = await this.sql<{ id: string }[]>`DELETE FROM session WHERE id = ${sessionId}
                                    RETURNING id;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async getBoards() {
		try {
			const rows = await this.sql<
				Board[]
			>`SELECT id, created_at, name, description, is_public FROM board;`;
			return rows;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async getPublicBoards() {
		try {
			const rows = await this.sql<Board[]>`SELECT id, created_at, name, description, is_public
                                                    FROM board
                                                    WHERE is_public = true;`;
			return rows;
		} catch (err) {
			throw parsePgError(err);
		}
	}
	/**
	 * @throws on DB connection error
	 */
	async getBoardByName(name: string) {
		try {
			const [row] = await this.sql<Board[]>`SELECT id, created_at, name, description, is_public
                                                    FROM board
                                                    WHERE name = ${name};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws if duplicate board name
	 * @throws on DB connection error
	 */
	async createBoard(board: Omit<Board, "id">) {
		const id = generateTextId();

		const { name, description, createdAt, isPublic } = board;

		try {
			const [row] = await this.sql<
				Board[]
			>`INSERT INTO board (id, name, description, created_at, is_public)
                VALUES (${id}, ${name}, ${description}, ${createdAt}, ${isPublic})
                RETURNING id, created_at, name, description, is_public;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async getPosts() {
		try {
			const rows = await this.sql<
				PostListPost[]
			>`SELECT p.id, p.created_at, p.updated_at, p.account_id, p.title, p.body,
                    p.board_id, a.display_name AS account_display_name, COUNT(r.id) AS reply_count,
                    b.name AS board_name
                FROM post p
                LEFT JOIN account a ON a.id = p.account_id
                LEFT JOIN reply r ON r.post_id = p.id
                LEFT JOIN board b ON b.id = p.board_id
                GROUP BY p.id, p.created_at, p.updated_at, p.account_id, p.title, p.body,
                    p.board_id, a.display_name, b.name
                ORDER BY p.created_at DESC;`;
			return rows;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async getPublicPosts() {
		try {
			const rows = await this.sql<PostListPost[]>`
                SELECT p.id, p.created_at, p.updated_at, p.account_id, p.title, p.body,
                    p.board_id, a.display_name AS account_display_name, COUNT(r.id) AS reply_count,
                    b.name AS board_name
                FROM post p
                LEFT JOIN account a ON a.id = p.account_id
                LEFT JOIN reply r ON r.post_id = p.id
                LEFT JOIN board b ON b.id = p.board_id
                WHERE b.is_public = true
                GROUP BY p.id, p.created_at, p.updated_at, p.account_id, p.title, p.body,
                    p.board_id, a.display_name, b.name
                ORDER BY p.created_at DESC;`;
			return rows;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async getPostsByBoardId(boardId: string) {
		try {
			const rows = await this.sql<PostListPost[]>`
                SELECT p.id, p.created_at, p.updated_at, p.account_id, p.title, p.body,
                    p.board_id, a.display_name AS account_display_name, COUNT(r.id) AS reply_count,
                    b.name AS board_name
                FROM post p
                LEFT JOIN account a ON a.id = p.account_id
                LEFT JOIN reply r ON r.post_id = p.id
                LEFT JOIN board b ON b.id = p.board_id
                WHERE p.board_id = ${boardId}
                GROUP BY p.id, p.created_at, p.updated_at, p.account_id, p.title, p.body,
                    p.board_id, a.display_name, b.name
                ORDER BY p.created_at DESC;`;
			return rows;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async createPost(post: Omit<Post, "id">) {
		const id = generateTextId();
		const { createdAt, updatedAt, accountId, title, body, boardId } = post;

		try {
			const [row] = await this.sql<
				Post[]
			>`INSERT INTO post (id, created_at, updated_at, account_id, title, body,
                board_id)
                VALUES (${id}, ${createdAt}, ${updatedAt}, ${accountId}, ${title}, ${body},
                ${boardId})
                RETURNING id, created_at, updated_at, account_id, title, body,
                board_id;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 */
	async getPostById(postId: string) {
		try {
			const [row] = await this.sql<
				(Post & { boardName: string; boardIsPublic: boolean; accountDisplayName: string })[]
			>`
                SELECT p.id, p.created_at, p.updated_at, p.account_id, p.title, p.body,
                       p.board_id, b.name AS board_name, b.is_public AS board_is_public, a.display_name AS account_display_name
                FROM post p
                LEFT JOIN board b ON b.id = p.board_id
                LEFT JOIN account a ON a.id = p.account_id
                WHERE p.id = ${postId};`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}
}
