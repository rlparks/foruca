export type Account = {
	id: string;
	userId: string;
	accountId: string;
	providerId: string;
	accessToken?: string;
	refreshToken?: string;
	idToken?: string;
	accessTokenExpiresAt?: Date;
	refreshTokenExpiresAt?: Date;
	scope?: string;
	password?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type Session = {
	id: string;
	expiresAt: Date;
	token: string;
	createdAt: Date;
	updatedAt: Date;
	ipAddress?: string;
	userAgent?: string;
	userId: string;
	impersonatedBy?: string;
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
	userId: string;
	title: string;
	body: string;
	boardId: string;
};

export type Reply = {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	userId: string;
	body: string;

	postId: string;
	parentId: string | null;
};

export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
	banned?: boolean;
	banReason?: string;
	banExpires?: Date;
};

export type Verification = {
	id: string;
	identifier: string;
	value: string;
	expiresAt: Date;
	createdAt?: Date;
	updatedAt?: Date;
};
