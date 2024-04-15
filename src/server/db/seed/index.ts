/* eslint-disable drizzle/enforce-delete-with-where */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "../schema";

import trips from "./trips.json";
import memberships from "./memberships.json";
import events from "./events.json";
import activities from "./activities.json";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  connection: postgres.Sql | undefined;
};

const connection =
  globalForDb.connection ?? postgres(env.DATABASE_URL, { prepare: false });
if (env.NODE_ENV !== "production") globalForDb.connection = connection;

const db = drizzle(connection, { schema });

const main = async () => {
  console.log("⏳ Running seed...");

  try {
    const start = Date.now();

    await seedTrips();
    await seedMemberships();
    await seedEvents();
    await seedActivities();

    const end = Date.now();

    console.log(`✅ Seed completed in ${end - start}ms`);
  } catch (error) {
    console.error("❌ Seed failed");
    console.error(error);
    process.exit(1);
  }
};

await main();

export async function seedTrips() {
  await db.delete(schema.trips);
  console.log(`📝 Inserting ${trips.length} trips`);
  await db.insert(schema.trips).values(trips);
}

export async function seedMemberships() {
  await db.delete(schema.memberships);
  console.log(`📝 Inserting ${memberships.length} memberships`);
  await db.insert(schema.memberships).values(memberships);
}

export async function seedEvents() {
  await db.delete(schema.events);
  console.log(`📝 Inserting ${events.length} events`);
  await db.insert(schema.events).values(events as schema.NewEvent[]);
}

export async function seedActivities() {
  await db.delete(schema.activities);
  console.log(`📝 Inserting ${activities.length} activities`);
  await db.insert(schema.activities).values(activities);
}
