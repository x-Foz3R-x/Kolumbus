/* eslint-disable drizzle/enforce-delete-with-where */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import trips from "./seed-data/trips.json";
import memberships from "./seed-data/memberships.json";
import places from "./seed-data/places.json";

const connection = postgres("db-url", { prepare: false });
const db = drizzle(connection, { schema });

const main = async () => {
  console.log("⏳ Running seed...");

  try {
    const start = Date.now();

    await seedTrips();
    await seedMemberships();
    await seedPlaces();

    const end = Date.now();

    console.log(`✅ Seed completed in ${end - start}ms`);
    process.exit();
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

export async function seedPlaces() {
  await db.delete(schema.places);
  console.log(`📝 Inserting ${places.length} events`);
  await db.insert(schema.places).values(places);
}
