export type Post = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: Date;
	updated: Date;
	expand: PostExpand;

	title: string;
	body: string;
	owner: string;
	parent: string;
	time: Date;
};

export type PostExpand = {
	owner: User;
};

export type User = {
	avatar: string;
	collectionId: string;
	collectionName: string;
	created: Date;
	email: string;
	emailVisibility: boolean;
	id: string;
	name: string;
	updated: Date;
	username: string;
	verified: boolean;
};
