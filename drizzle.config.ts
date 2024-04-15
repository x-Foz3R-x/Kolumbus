import { loadEnvConfig } from "@next/env";
import type { Config } from "drizzle-kit";
import { cwd } from "node:process";

loadEnvConfig(cwd());

export default {
  driver: "pg",
  out: "./drizzle",
  schema: "./src/db/schema",
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
} satisfies Config;
