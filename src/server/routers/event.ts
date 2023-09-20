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
});

export default event;
