export type Account = {
	id: string;
	username: string;
	displayName: string;
	isAdmin: boolean;
};

export type Session = {
	id: string;
	accountId: string;
	createdAt: Date;
	lastActivityAt: Date;
	lastIp: string;
	userAgent: string;
	expiresAt: Date;
};

export type AuthInfo = {
	authEndpoint: string;
	tokenEndpoint: string;
	userinfoEndpoint: string;
	endSessionEndpoint: string;
};

export type Board = {
	id: string;
	createdAt: Date;
	name: string;
	description: string | null;
	isPublic: boolean;
};

export type Post = {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	accountId: string;
	title: string;
	body: string;

	boardId: string | null;
	parentId: string | null;
};
