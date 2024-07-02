export type RawPost = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	expand: { owner: RawUser };

	title: string;
	body: string;
	owner: string;
	parent: string;
};

export type SafePost = {
	id: string;
	title: string;
	body: string;
	owner: SafeUser | null;
	created: string;
};

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

export type SafeUser = {
	id: string;
	username: string;
	name: string;
	hasAvatar: boolean;
};
