import { z } from "zod";
import { EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";

// Define a schema for the Event model
const eventSchema = z.object({
  name: z.string().optional(),
  date: z.string().optional(),
  address: z.string().optional(),
  cost: z.number().optional(),
  phoneNumber: z.string().optional(),
  website: z.string().optional(),
  note: z.string().optional(),
  type: z.nativeEnum(EventType).optional(),
  googlePlaceId: z.string().optional(),
  position: z.number().optional(),
  createdBy: z.string().optional(),
});

const event = router({
  getAll: protectedProcedure.input(z.object({ tripId: z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.user.id) return;

    const events = await prisma.event.findMany({
      where: {
        tripId: input.tripId,
      },
      orderBy: [
        {
          date: "asc",
        },
        { position: "asc" },
      ],
    });

    return events;
  }),
  update: protectedProcedure
    .input(z.object({ eventId: z.string(), event: eventSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) return;

      console.log("update");

      await prisma.event.update({
        where: {
          id: input.eventId,
        },
        data: input.event,
      });
    }),
});

export default event;
