import { z } from "zod";
import {
  insertTripSchema,
  selectActivitySchema,
  selectEventSchema,
  selectFlightSchema,
  selectTransportationSchema,
  selectTripSchema,
} from "~/server/db/schema";

export const tripSchema = z.object({ id: z.string() });

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
    events: z.array(
      selectEventSchema.extend({
        activity: selectActivitySchema,
        transportation: selectTransportationSchema,
        flight: selectFlightSchema,
      }),
    ),
  }),
});

export const createTripSchema = insertTripSchema.extend({
  id: z.string(),
  position: z.number().nonnegative(),
});

export const duplicateTripSchema = tripSchema.extend({ duplicateId: z.string() });

export const updateTripSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const findTripInviteSchema = z.object({ inviteCode: z.string() });
export const createTripInviteSchema = tripSchema.extend({ inviteCode: z.string() });

export const joinTripSchema = tripSchema.extend({ permissions: z.number().optional() });

export type Trip = z.infer<typeof tripSchema>;
export type TripContext = z.infer<typeof tripContextSchema>;
export type CreateTrip = z.infer<typeof createTripSchema>;
export type DuplicateTrip = z.infer<typeof duplicateTripSchema>;
export type FindTripInvite = z.infer<typeof findTripInviteSchema>;
export type JoinTrip = z.infer<typeof joinTripSchema>;
