import { z } from "zod";
import { Currency } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { eventSchema, PlaceOpeningHours } from "@/types";

export type UpdateEventData = z.infer<typeof updateSchema>;
const updateSchema = z.object({
  id: z.string().cuid2("Invalid event id").optional(),
  placeId: z.string().nullable().optional(),

  name: z.string().optional(),
  address: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  cost: z.number().optional(),
  currency: z.nativeEnum(Currency).optional(),
  website: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  openingHours: PlaceOpeningHours.optional(),
  // photoAlbum: z.array(z.string()).optional(),
  photo: z.string().nullable().optional(),

  date: z.string().optional(),
  position: z.number().optional(),
});

const event = router({
  create: protectedProcedure.input(eventSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    const { updatedAt, createdAt, ...eventData } = input;

    await prisma.trip.update({ where: { id: input.tripId }, data: { updatedAt: new Date() } });
    return await prisma.event.create({ data: { ...eventData } });
  }),
  update: protectedProcedure
    .input(z.object({ eventId: z.string().cuid2("Invalid event id"), tripId: z.string().cuid2("Invalid trip id"), data: updateSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      const { id, ...data } = input.data;

      await prisma.trip.update({ where: { id: input.tripId }, data: { updatedAt: new Date() } });
      return await prisma.event.update({ where: { id: input.eventId }, data });
    }),
  delete: protectedProcedure
    .input(z.object({ eventId: z.string().cuid2("Invalid event id"), tripId: z.string().cuid2("Invalid trip id") }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      await prisma.trip.update({ where: { id: input.tripId }, data: { updatedAt: new Date() } });
      await prisma.event.delete({ where: { id: input.eventId } });
    }),
});

export default event;
