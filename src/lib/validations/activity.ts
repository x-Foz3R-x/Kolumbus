import { z } from "zod";
import { selectActivitySchema } from "~/server/db/schema";

export const activitySchema = selectActivitySchema.extend({
  openingHours: z.array(
    z.object({
      day: z.number(),
      open: z.string(),
      close: z.string().optional(),
    }),
  ),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
