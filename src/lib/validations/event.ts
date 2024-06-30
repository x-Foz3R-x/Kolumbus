import { z } from "zod";

import {
  selectEventSchema as event,
  selectFlightSchema,
  selectTransportationSchema,
  type eventTypesSchema,
} from "~/server/db/schema";
import { activitySchema } from "./activity";

export const deleteEventSchema = z.object({
  id: z.string().length(16),
  tripId: z.string().length(10),
  date: z.string(),
  position: z.number(),
  createdBy: z.string().optional(),
});

export const eventSchema = event.extend({
  activity: activitySchema.nullable().optional(),
  transportation: selectTransportationSchema.nullable().optional(),
  flight: selectFlightSchema.nullable().optional(),
});

export const updateEventSchema = z.object({
  eventId: z.string(),
  tripId: z.string(),
  data: event.partial().extend({
    activity: activitySchema.partial().optional(),
    transportation: selectTransportationSchema.partial().optional(),
    flight: selectFlightSchema.partial().optional(),
  }),
});

export const activityEventSchema = event.extend({ activity: activitySchema });
export const flightEventSchema = event.extend({ flight: selectFlightSchema });
export const transportationEventSchema = event.extend({
  transportation: selectTransportationSchema,
});

export type Event = z.infer<typeof event>;
export type EventTypes = z.infer<typeof eventTypesSchema>;
export type EventSchema = z.infer<typeof eventSchema>;
export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
export type ActivityEventSchema = z.infer<typeof activityEventSchema>;
export type FlightEventSchema = z.infer<typeof flightEventSchema>;
export type TransportationEventSchema = z.infer<typeof transportationEventSchema>;
