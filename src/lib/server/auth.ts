import { betterAuth } from "better-auth";
import { PostgresJSDialect } from "kysely-postgres-js";
import { getInstance } from "./db/postgres";

export const auth = betterAuth({
	database: {
		dialect: new PostgresJSDialect({
			postgres: getInstance(true),
		}),
		type: "postgres",
	},
});
