export type Post = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	expand: PostExpand;

	title: string;
	body: string;
	owner: string;
	parent: string;
	time: string;
};

export type PostExpand = {
	owner: User;
};

export type User = {
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
