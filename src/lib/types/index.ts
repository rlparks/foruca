export type Account = {
	id: string;
	username: string;
	displayName: string;
	isAdmin: boolean;
};

export type Session = {
	id: string;
	accountId: string;
	tokenHash: string;
	createdAt: Date;
	lastActivityAt: Date;
	lastIp: string;
	userAgent: string;
	expiresAt: Date;
	oidcIdToken: string;
};
