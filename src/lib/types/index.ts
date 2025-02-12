/**
 * `Post`s directly returned from PocketBase.
 */
export type RawPost = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	expand: { owner: RawUser; board: RawBoard };

	title: string;
	body: string;
	owner: string;
	parent: string;
};

/**
 * `Post`s with additional info removed.
 */
export type SafePost = {
	id: string;
	title: string;
	body: string;
	owner: SafeUser | null;
	board: SafeBoard | null;
	created: string;
};

/**
 * `User`s directly returned from PocketBase.
 */
export type RawUser = {
	avatar: string;
	collectionId: string;
	collectionName: string;
	created: string;
	email: string;
	emailVisibility: boolean;
	id: string;
	name: string;
	updated: string;
	username: string;
	verified: boolean;
};

/**
 * `User`s with additional info removed.
 */
export type SafeUser = {
	id: string;
	username: string;
	name: string;
	hasAvatar: boolean;
};

/**
 * `Board`s directly returned from PocketBase.
 */
export type RawBoard = {
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;

	id: string;
	name: string;
};

/**
 * `Board`s with additional info removed.
 */
export type SafeBoard = {
	id: string;
	name: string;
};
