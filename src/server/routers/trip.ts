import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { GenerateItinerary } from "@/lib/utils";

import type { Trip, Event } from "@/types";

// Define a schema for the Trip model
const tripSchema = z.object({
  userId: z.string().optional(),
  name: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  days: z.number().optional(),
  position: z.number().optional(),
});

const trip = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id) return;

    const trips = await prisma.trip.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        position: "asc",
      },
    });

    return trips;
  }),
  getAllWithEvents: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id) return;

    const trips = await prisma.trip.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        position: "asc",
      },
    });

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];

      const events: Event[] = await prisma.event.findMany({
        where: {
          tripId: trip.id,
        },
        orderBy: [
          {
            date: "asc",
          },
          { position: "asc" },
        ],
      });

      (trip as Trip).itinerary = GenerateItinerary(trip, events);
    }

    return trips as Trip[];
  }),
  update: protectedProcedure
    .input(z.object({ tripId: z.string().cuid2("Invalid trip id"), data: tripSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      await prisma.trip.update({
        where: {
          id: input.tripId,
          userId: ctx.user.id,
        },
        data: input.data,
      });
    }),
});

export default trip;
