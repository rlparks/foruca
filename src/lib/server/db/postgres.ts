import { env } from "$env/dynamic/private";
import postgres from "postgres";

let client: postgres.Sql | null = null;

export function getInstance(cache: boolean) {
	if (cache && client) {
		return client;
	}
	const url = env.DATABASE_URL ?? "";
	if (!url) throw new Error("Environment variable DATABASE_URL is not set");

	client = postgres(url, { transform: postgres.camel });

	return client;
}

export function getPlainInstance() {
	const url = env.DATABASE_URL ?? "";
	if (!url) throw new Error("Environment variable DATABASE_URL is not set");

	client = postgres(url);

	return client;
}
