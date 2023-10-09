import { z } from "zod";
import { Currency, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { PlaceOpeningHours } from "@/types";

export type UpdateEvent = z.infer<typeof updateSchema>;
const updateSchema = z.object({
  id: z.string().cuid2("Invalid event id").optional(),
  placeId: z.string().nullable().optional(),

  name: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  cost: z.number().nullable().optional(),
  currency: z.nativeEnum(Currency).optional(),
  website: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  openingHours: PlaceOpeningHours.optional(),
  photoAlbum: z.array(z.string()).optional(),
  photo: z.string().nullable().optional(),

  type: z.nativeEnum(EventType).optional(),
  position: z.number().optional(),
  date: z.string().datetime().optional(),
});
const createSchema = z.object({
  id: z.string().cuid2("Invalid event id"),
  tripId: z.string().cuid2("Invalid trip id"),
  placeId: z.string().nullable(),

  name: z.string().nullable(),
  address: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  cost: z.number().nullable(),
  currency: z.nativeEnum(Currency),
  website: z.string().nullable(),
  url: z.string().nullable(),
  note: z.string().nullable(),
  openingHours: PlaceOpeningHours,
  photoAlbum: z.array(z.string()),
  photo: z.string().nullable(),

  type: z.nativeEnum(EventType),
  position: z.number(),
  date: z.string().datetime(),
  updatedAt: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
});

const event = router({
  update: protectedProcedure
    .input(z.object({ eventId: z.string().cuid2("Invalid event id"), data: updateSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      const { id, ...data } = input.data;
      await prisma.event.update({ where: { id: input.eventId }, data });
    }),
  create: protectedProcedure.input(createSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    const { updatedAt, createdAt, ...eventData } = input;
    const event = await prisma.event.create({ data: { ...eventData } });

    return event;
  }),
  delete: protectedProcedure
    .input(z.object({ eventId: z.string().cuid2("Invalid event id"), events: z.array(updateSchema) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      for (let i = 0; i < input.events.length; i++) {
        const { id, ...data } = input.events[i];
        await prisma.event.update({ where: { id }, data });
      }

      await prisma.event.delete({ where: { id: input.eventId } });
    }),
});

export default event;
