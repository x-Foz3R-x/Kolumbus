import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";
import { cwd } from "node:process";

import * as schema from "@/db/schema";

import trips from "@/data/seed/trips.json";
import memberships from "@/data/seed/memberships.json";
import events from "@/data/seed/events.json";
import activities from "@/data/seed/activities.json";

loadEnvConfig(cwd());

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

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

main();

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
