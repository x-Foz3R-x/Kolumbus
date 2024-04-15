import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";
import { cwd } from "node:process";

import * as schema from "@/db/schema";

loadEnvConfig(cwd());

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

export default db;
