// place files you want to import through the `$lib` alias in this folder.

import type { RawBoard, RawPost, RawUser, SafeBoard, SafePost, SafeUser } from "./types";

/**
 * The default number of posts on each page.
 */
export const DEFAULT_PER_PAGE = 10;

/**
 * Removes unnecessary info from User objects returned from
 * PocketBase, like email.
 *
 * @param user the full {@link RawUser} object
 * @returns a {@link SafeUser} object with a minimum amount of info
 */
export function hideUserInfo(user: RawUser): SafeUser {
	return {
		id: user.id,
		username: user.username,
		name: user.name,
		hasAvatar: !!user.avatar
	};
}

/**
 * Removes unnecessary info from Post objects
 * returned from PocketBase.
 *
 * If the user requesting the post is not authenticated,
 * PocketBase will not return the owner and it will be `null`.
 *
 * @param post the full {@link RawPost} object
 * @returns a {@link SafePost} object with a minimum amount of info
 */
export function makePostSafe(post: RawPost): SafePost {
	return {
		id: post.id,
		title: post.title,
		body: post.body,
		owner: post?.expand?.owner ? hideUserInfo(post.expand.owner) : null,
		board: post?.expand?.board ? makeBoardSafe(post.expand.board) : null,
		created: post.created
	};
}

/**
 * Removes unnecessary info from Board objects
 * returned from PocketBase.
 *
 * @param board the full {@link RawBoard} object
 * @returns a {@link SafeBoard} object with a minimum amount of info
 */
export function makeBoardSafe(board: RawBoard): SafeBoard {
	return {
		id: board.id,
		name: board.name
	};
}
