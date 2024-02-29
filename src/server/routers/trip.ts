import { Event as prismaEvent, Trip as prismaTrip } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { generateItinerary } from "@/lib/utils";
import { tripSchema, Trip, Event } from "@/types";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [x: string]: JsonValue };
type JsonArray = JsonValue[];

const updateSchema = z.object({
  name: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  position: z.number().optional(),
  updatedAt: z.date().optional(),
});

const trip = router({
  create: protectedProcedure.input(tripSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    const { itinerary, updatedAt, createdAt, ...tripData } = input;
    const trip = await prisma.trip.create({ data: tripData });

    return createTrip(trip, []);
  }),

  //#region Read
  find: protectedProcedure.input(z.object({ tripId: z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    const trips = await prisma.trip.findFirst({
      where: { id: input.tripId },
    });

    return trips;
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id) return;

    const trips = await prisma.trip.findMany({
      where: { userId: ctx.user.id },
      orderBy: { position: "asc" },
    });

    return trips;
  }),
  getAllWithEvents: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id) return;

    const trips = await prisma.trip.findMany({
      where: { userId: ctx.user.id },
      orderBy: { position: "asc" },
    });

    return await createTrips(trips);
  }),
  //#endregion

  update: protectedProcedure
    .input(z.object({ tripId: z.string().cuid2("Invalid trip id"), data: updateSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      return await prisma.trip.update({
        where: { userId: ctx.user.id, id: input.tripId },
        data: input.data,
      });
    }),

  delete: protectedProcedure.input(z.object({ tripId: z.string().cuid2("Invalid trip id") })).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    return await prisma.trip.delete({
      where: { userId: ctx.user.id, id: input.tripId },
    });
  }),
});

export default trip;

/**
 * Creates an array of Trip objects based on the provided prismaTrip array.
 * @param trips - The array of prismaTrip objects.
 * @returns A Promise that resolves to an array of Trip objects.
 */
async function createTrips(trips: prismaTrip[]): Promise<Trip[]> {
  return Promise.all(
    trips.map(async (trip) => {
      const events = await prisma.event.findMany({
        where: { tripId: trip.id },
        orderBy: [{ position: "asc" }],
      });

      return createTrip(trip, events);
    }),
  );
}

/**
 * Creates a Trip object based on the provided trip and events data.
 * @param trip - The trip data.
 * @param events - The events data.
 * @returns The created Trip object.
 */
function createTrip(trip: prismaTrip, events: prismaEvent[]): Trip {
  return {
    ...trip,
    updatedAt: trip.updatedAt.toISOString(),
    createdAt: trip.createdAt.toISOString(),
    itinerary: generateItinerary(trip.startDate, trip.endDate, formatEvents(events)),
  } as Trip;
}

/**
 * Formats an array of events.
 * @param events - The array of events to be formatted.
 * @returns The formatted array of events.
 */
function formatEvents(events: prismaEvent[]): Event[] {
  return events.map((event) => ({
    ...event,
    updatedAt: event.updatedAt instanceof Date ? event.updatedAt.toISOString() : event.updatedAt,
    createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
    openingHours: typeof event.openingHours === "object" ? (event.openingHours as JsonObject) : {},
  }));
}
