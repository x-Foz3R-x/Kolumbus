import { z } from "zod";

import {
  selectActivitySchema,
  selectEventSchema,
  selectFlightSchema,
  selectTransportationSchema,
} from "~/server/db/schema";

export const eventSchema = selectEventSchema.extend({
  activity: selectActivitySchema,
  transportation: selectTransportationSchema,
  flight: selectFlightSchema,
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

export type Event = z.infer<typeof eventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
