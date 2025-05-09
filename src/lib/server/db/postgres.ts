import { env } from "$env/dynamic/private";
import postgres from "postgres";

export function getInstance() {
	const url = env.DATABASE_URL ?? "";
	if (!url) throw new Error("Environment variable DATABASE_URL is not set");

	return postgres(url, { transform: postgres.camel });
}
