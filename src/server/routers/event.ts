import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

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
  // update: protectedProcedure
  //   .input(z.object({ tripId: z.string(), data: tripDataSchema }))
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.user.id) return;

  //     const updatedTrips = await prisma.trip.update({
  //       where: {
  //         id: input.tripId,
  //         userId: ctx.user.id,
  //       },
  //       data: input.data,
  //     });

  //     console.log(updatedTrips.updatedAt);
  //   }),
});

export default event;
