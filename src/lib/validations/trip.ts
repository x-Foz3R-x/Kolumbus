import { z } from "zod";
import { insertTripSchema, selectTripSchema } from "~/server/db/schema";
import { eventSchema } from "./event";

const daySchema = z.object({
  id: z.string().max(12),
  events: eventSchema.array(),
});
export const itinerarySchema = daySchema.array();

export const tripSchema = selectTripSchema.extend({
  members: z.array(
    z.object({
      userId: z.string(),
      name: z.string().nullable(),
      image: z.string(),
      owner: z.boolean(),
      permissions: z.number(),
      createdAt: z.date(),
    }),
  ),
  itinerary: itinerarySchema,
});

export const tripContextSchema = z.object({
  myMemberships: z.array(
    z.object({
      trip: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
        owner: z.boolean(),
        startDate: z.string(),
        endDate: z.string(),
        position: z.number(),
      }),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
  trip: selectTripSchema.extend({
    members: z.array(
      z.object({
        userId: z.string(),
        name: z.string().nullable(),
        image: z.string(),
        owner: z.boolean(),
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

export const findTripInviteSchema = z.object({ inviteCode: z.string() });
export const createTripInviteSchema = tripIdSchema.extend({ inviteCode: z.string() });
export const joinTripSchema = tripIdSchema.extend({ permissions: z.number().optional() });

export type Trip = z.infer<typeof tripSchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
export type Day = z.infer<typeof daySchema>;
export type TripContext = z.infer<typeof tripContextSchema>;
