import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import type { Board, Post, Reply } from "$lib/types";
import type { PostListPost, PrettyReply } from "$lib/types/bonus";
import postgres from "postgres";

export class Queries {
	private readonly sql: postgres.Sql;
	constructor(sql: postgres.Sql) {
		this.sql = sql;
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
			>`SELECT p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                    p.board_id, u.name AS user_name, COUNT(r.id)::int AS reply_count,
                    b.name AS board_name
                FROM post p
                LEFT JOIN "user" u ON u.id = p.user_id
                LEFT JOIN reply r ON r.post_id = p.id
                LEFT JOIN board b ON b.id = p.board_id
                GROUP BY p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                    p.board_id, u.name, b.name
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
                SELECT p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                    p.board_id, u.name AS user_name, COUNT(r.id)::int AS reply_count,
                    b.name AS board_name
                FROM post p
                LEFT JOIN "user" u ON u.id = p.user_id
                LEFT JOIN reply r ON r.post_id = p.id
                LEFT JOIN board b ON b.id = p.board_id
                WHERE b.is_public = true
                GROUP BY p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                    p.board_id, u.name, b.name
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
                SELECT p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                    p.board_id, u.name AS user_name, COUNT(r.id)::int AS reply_count,
                    b.name AS board_name
                FROM post p
                LEFT JOIN "user" u ON u.id = p.user_id
                LEFT JOIN reply r ON r.post_id = p.id
                LEFT JOIN board b ON b.id = p.board_id
                WHERE p.board_id = ${boardId}
                GROUP BY p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                    p.board_id, u.name, b.name
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
		const { createdAt, updatedAt, userId, title, body, boardId } = post;

		try {
			const [row] = await this.sql<
				Post[]
			>`INSERT INTO post (id, created_at, updated_at, user_id, title, body,
                board_id)
                VALUES (${id}, ${createdAt}, ${updatedAt}, ${userId}, ${title}, ${body},
                ${boardId})
                RETURNING id, created_at, updated_at, user_id, title, body,
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
				(PostListPost & {
					boardId: string;
					boardIsPublic: boolean;
				})[]
			>`
                SELECT p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                       p.board_id, b.name AS board_name, b.is_public AS board_is_public, u.name AS user_name,
                       COUNT(r.id)::int AS reply_count
                FROM post p
                LEFT JOIN board b ON b.id = p.board_id
                LEFT JOIN "user" u ON u.id = p.user_id
                LEFT JOIN reply r ON r.post_id = p.id
                WHERE p.id = ${postId}
                GROUP BY p.id, p.created_at, p.updated_at, p.user_id, p.title, p.body,
                         p.board_id, b.name, b.is_public, u.name;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	async getRepliesByPostId(postId: string) {
		try {
			const rows = await this.sql<PrettyReply[]>`
                SELECT r.id, r.created_at, r.updated_at, r.user_id, r.post_id, r.body, r.parent_id,
                       u.name AS user_name
                FROM reply r
                LEFT JOIN "user" u ON u.id = r.user_id
                WHERE r.post_id = ${postId}
                ORDER BY r.created_at;`;
			return rows;
		} catch (err) {
			throw parsePgError(err);
		}
	}

	/**
	 * @throws on DB connection error
	 * @throws if parent does not exist
	 */
	async createReply(reply: Omit<Reply, "id">) {
		const id = generateTextId();
		const { createdAt, updatedAt, userId, postId, body, parentId } = reply;

		try {
			const [row] = await this.sql<Reply[]>`
                INSERT INTO reply (id, created_at, updated_at, user_id, post_id, body, parent_id)
                VALUES (${id}, ${createdAt}, ${updatedAt}, ${userId}, ${postId}, ${body}, ${parentId})
                RETURNING id, created_at, updated_at, user_id, post_id, body, parent_id;`;
			return row;
		} catch (err) {
			throw parsePgError(err);
		}
	}
}
