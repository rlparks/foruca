export type Post = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: Date;
	updated: Date;

	title: string;
	body: string;
	owner: string;
	parent: string;
	time: Date;
};
