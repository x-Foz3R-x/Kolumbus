import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { GenerateItinerary } from "@/lib/utils";
import { ItinerarySchema } from "@/types";

const updateSchema = z.object({
  name: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  position: z.number().optional(),
});

type ServerTrip = z.infer<typeof ServerTrip>;
const ServerTrip = z.object({
  id: z.string().cuid2("Not a cuid2"),
  userId: z.string(),

  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  position: z.number(),
  itinerary: ItinerarySchema,

  createdAt: z.date(),
  updatedAt: z.date(),
});

const trip = router({
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

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];

      const events = await prisma.event.findMany({
        where: { tripId: trip.id },
        orderBy: [{ position: "asc" }],
      });

      (trip as ServerTrip).itinerary = GenerateItinerary(trip.id, trip.startDate, trip.endDate, events);
    }

    return trips as ServerTrip[];
  }),
  //#endregion
  update: protectedProcedure
    .input(z.object({ tripId: z.string().cuid2("Invalid trip id"), data: updateSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      await prisma.trip.update({
        where: { userId: ctx.user.id, id: input.tripId },
        data: input.data,
      });
    }),
});

export default trip;
