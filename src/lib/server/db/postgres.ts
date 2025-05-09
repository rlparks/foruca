import { env } from "$env/dynamic/private";
import postgres from "postgres";

const url = env.DATABASE_URL ?? "";
if (!url) console.error("DATABASE_URL is not set!");
// build spoinks...
// if (!url) throw new Error("Environment variable DATABASE_URL is not set");

export const sql = postgres(url, { transform: postgres.camel });
