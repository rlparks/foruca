// place files you want to import through the `$lib` alias in this folder.

import type { RawPost, RawUser, SafePost, SafeUser } from "./types";

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
		created: post.created
	};
}
