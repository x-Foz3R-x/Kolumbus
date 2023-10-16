import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { GenerateItinerary } from "@/lib/utils";
import { itinerarySchema, tripSchema } from "@/types";

export type ServerTrip = z.infer<typeof serverTrip>;
const serverTrip = z.object({
  id: z.string().cuid2("Not a cuid2"),
  userId: z.string(),

  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  position: z.number(),
  itinerary: itinerarySchema,

  createdAt: z.date(),
  updatedAt: z.date(),
});
const updateSchema = z.object({
  name: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  position: z.number().optional(),
});

const trip = router({
  create: protectedProcedure.input(tripSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    const { itinerary, updatedAt, createdAt, ...tripData } = input;
    const trip = await prisma.trip.create({
      data: tripData,
    });

    const events = await prisma.event.findMany({
      where: { tripId: trip.id },
      orderBy: [{ position: "asc" }],
    });

    (trip as ServerTrip).itinerary = GenerateItinerary(trip.id, trip.startDate, trip.endDate, events);

    return trip as ServerTrip;
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
