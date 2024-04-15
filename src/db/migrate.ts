import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from ".";

const main = async () => {
  console.log("⏳ Running migrations...");

  try {
    const start = Date.now();

    await migrate(db, { migrationsFolder: "./drizzle" });

    const end = Date.now();

    console.log(`✅ Migrations completed in ${end - start}ms`);
  } catch (error) {
    console.error("❌ Migration failed");
    console.error(error);
    process.exit(1);
  }
};

main();
