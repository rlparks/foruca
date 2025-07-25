import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { betterAuth } from "better-auth";
import { admin, createAuthMiddleware, genericOAuth } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { PostgresJSDialect } from "kysely-postgres-js";
import { getPlainInstance } from "./db/postgres";

export const auth = betterAuth({
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-out") {
				console.log("HELO");
			}
		}),
	},
	advanced: {
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
		admin({
			schema: {
				user: {
					fields: {
						banReason: "ban_reason",
						banExpires: "ban_expires",
					},
				},
				session: {
					fields: {
						impersonatedBy: "impersonated_by",
					},
				},
			},
		}),
		sveltekitCookies(() => new Promise((resolve) => resolve(getRequestEvent()))), // ???
	],
	database: {
		dialect: new PostgresJSDialect({
			postgres: getPlainInstance(),
		}),
		type: "postgres",
	},
	verification: {
		fields: {
			expiresAt: "expires_at",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
	account: {
		fields: {
			accountId: "account_id",
			providerId: "provider_id",
			userId: "user_id",
			accessToken: "access_token",
			refreshToken: "refresh_token",
			accessTokenExpiresAt: "access_token_expires_at",
			createdAt: "created_at",
			updatedAt: "updated_at",
			idToken: "id_token",
			refreshTokenExpiresAt: "refresh_token_expires_at",
		},
	},
	user: {
		fields: {
			emailVerified: "email_verified",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
	session: {
		fields: {
			expiresAt: "expires_at",
			createdAt: "created_at",
			updatedAt: "updated_at",
			ipAddress: "ip_address",
			userAgent: "user_agent",
			userId: "user_id",
		},
	},
});
