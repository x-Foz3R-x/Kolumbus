import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  driver: "pg",
  schema: "./src/server/db/schema",
  dbCredentials: { connectionString: env.DATABASE_URL },
} satisfies Config;
