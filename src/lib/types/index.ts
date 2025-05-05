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
