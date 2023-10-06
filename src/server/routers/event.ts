import { z } from "zod";
import { Currency, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { PlaceOpeningHours } from "@/types";

const updateSchema = z.object({
  placeId: z.string().nullable().optional(),

  name: z.string().optional(),
  cost: z.number().optional(),
  currency: z.nativeEnum(Currency).optional(),
  note: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  photoAlbum: z.array(z.string()).optional(),

  address: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  openingHours: PlaceOpeningHours.or(z.object({})).optional(),

  type: z.nativeEnum(EventType).optional(),
  position: z.number().optional(),
  date: z.string().datetime().optional(),
});
const createSchema = z.object({
  id: z.string().cuid2("Invalid event id"),
  tripId: z.string().cuid2("Invalid trip id"),
  placeId: z.string().nullable(),

  name: z.string(),
  cost: z.number(),
  currency: z.nativeEnum(Currency),
  note: z.string().nullable(),
  photo: z.string().nullable(),
  photoAlbum: z.array(z.string()),

  address: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  url: z.string().nullable(),
  website: z.string().nullable(),
  openingHours: PlaceOpeningHours.or(z.object({})),

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

      await prisma.event.update({
        where: {
          id: input.eventId,
        },
        data: input.data,
      });
    }),
  create: protectedProcedure.input(createSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    const { updatedAt, createdAt, ...eventData } = input;
    const event = await prisma.event.create({ data: { ...eventData } });

    return event;
  }),
});

export default event;
