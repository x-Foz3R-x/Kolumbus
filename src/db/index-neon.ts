import { neon, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import { loadEnvConfig } from "@next/env";
import { cwd } from "node:process";

import * as schema from "@/db/schema";

loadEnvConfig(cwd());

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const dbTx = drizzleServerless(pool);

export default db;
