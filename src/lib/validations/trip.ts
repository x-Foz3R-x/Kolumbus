import { z } from "zod";
import { insertTripSchema, selectTripSchema as trip } from "~/server/db/schema";
import { eventSchema } from "./event";

const daySchema = z.object({
  id: z.string(),
  date: z.string(),
  events: eventSchema.array(),
});
export const itinerarySchema = daySchema.array();

export { trip };

export const tripSchema = trip.extend({
  members: z.array(
    z.object({
      userId: z.string(),
      name: z.string().nullable(),
      image: z.string(),
      permissions: z.number(),
      createdAt: z.date(),
    }),
  ),
  itinerary: itinerarySchema,
});

const getTripSchema = trip.extend({
  members: z.array(
    z.object({
      userId: z.string(),
      name: z.string().nullable(),
      image: z.string(),
      permissions: z.number(),
      createdAt: z.date(),
    }),
  ),
  events: eventSchema.array(),
});

export const tripContextSchema = z.object({
  myMemberships: z.array(
    z.object({
      trip: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
        startDate: z.string(),
        endDate: z.string(),
        position: z.number(),
        owner: z.boolean(),
      }),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
  trip: trip.extend({
    members: z.array(
      z.object({
        userId: z.string(),
        name: z.string().nullable(),
        image: z.string(),
        permissions: z.number(),
        createdAt: z.date(),
      }),
    ),
    events: eventSchema.array(),
  }),
});

export const tripIdSchema = z.object({ id: z.string().length(10) });

export const createTripSchema = insertTripSchema.extend({
  id: z.string(),
  position: z.number().nonnegative(),
});
export const duplicateTripSchema = tripIdSchema.extend({ duplicateId: z.string().length(10) });

export const updateTripSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const findInviteSchema = z.object({ inviteCode: z.string() });
export const updateInviteSchema = tripIdSchema.extend({ inviteCode: z.string().nullable() });

export type Trip = z.infer<typeof trip>;
export type TripSchema = z.infer<typeof tripSchema>;
export type GetTripSchema = z.infer<typeof getTripSchema>;
export type TripContextSchema = z.infer<typeof tripContextSchema>;
export type ItinerarySchema = z.infer<typeof itinerarySchema>;
export type DaySchema = z.infer<typeof daySchema>;
