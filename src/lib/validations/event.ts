import { z } from "zod";

import {
  selectActivitySchema,
  selectEventSchema,
  selectFlightSchema,
  selectTransportationSchema,
} from "~/server/db/schema";

export const deleteEventSchema = z.object({
  id: z.string().length(16),
  tripId: z.string().length(10),
  date: z.string(),
  position: z.number(),
  createdBy: z.string().optional(),
});

export const eventSchema = selectEventSchema.extend({
  activity: selectActivitySchema.nullable().optional(),
  transportation: selectTransportationSchema.nullable().optional(),
  flight: selectFlightSchema.nullable().optional(),
});

export const updateEventSchema = z.object({
  eventId: z.string(),
  tripId: z.string(),
  data: selectEventSchema.partial().extend({
    activity: selectActivitySchema.partial().optional(),
    transportation: selectTransportationSchema.partial().optional(),
    flight: selectFlightSchema.partial().optional(),
  }),
});

export const activitySchema = selectEventSchema.extend({ activity: selectActivitySchema });

export type Event = z.infer<typeof eventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;

export type ActivityEvent = z.infer<typeof activitySchema>;
