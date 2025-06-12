import { env } from "$env/dynamic/private";
import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { PostgresJSDialect } from "kysely-postgres-js";
import { getInstance } from "./db/postgres";

export const auth = betterAuth({
	advanced: {
		useSecureCookies: true,
		cookiePrefix: "foruca",
	},
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: "rebeccid",
					clientId: env.OIDC_CLIENT_ID,
					clientSecret: env.OIDC_CLIENT_SECRET,
					discoveryUrl: env.OIDC_DISCOVERY_URL,
					scopes: ["openid", "email", "profile"],
				},
			],
		}),
	],
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	database: {
		dialect: new PostgresJSDialect({
			postgres: getInstance(true),
		}),
		type: "postgres",
		casing: "snake", // doesn't seem to do anything?
	},
	user: {
		fields: {
			name: "name",
			email: "email",
			emailVerified: "email_verified",
			image: "image",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
	session: {
		fields: {
			userId: "user_id",
			token: "token",
			expiresAt: "expires_at",
			ipAddress: "ip_address",
			userAgent: "user_agent",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
	account: {
		fields: {
			userId: "user_id",
			accountId: "account_id",
			providerId: "provider_id",
			accessToken: "access_token",
			refreshToken: "refresh_token",
			idToken: "id_token",
			accessTokenExpiresAt: "access_token_expires_at",
			refreshTokenExpiresAt: "refresh_token_expires_at",
			scope: "scope",
			password: "password",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
	verification: {
		fields: {
			identifier: "identifier",
			value: "value",
			expiresAt: "expires_at",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
});
