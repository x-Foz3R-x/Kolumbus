/* eslint-disable drizzle/enforce-delete-with-where */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import trips from "./seed-data/trips.json";
import memberships from "./seed-data/memberships.json";
import events from "./seed-data/events.json";
import activities from "./seed-data/activities.json";

const connection = postgres(
  "postgres://postgres.azkhztdwoqyqaqayrdph:lnYoQ6Cum70t5xBy@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
  { prepare: false },
);
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
