import { z } from "zod";

import { selectPlaceSchema as place } from "~/server/db/schema";
import { placeId, tripId } from ".";

export const placeSchema = place;

export const placeDetailsSchema = placeSchema.omit({
  id: true,
  tripId: true,
  googleId: true,
  dayIndex: true,
  sortIndex: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePlaceSchema = z.object({
  tripId,
  placeId,
  modifiedFields: placeDetailsSchema.partial(),
});

export const updatePlacementSchema = z.object({
  tripId,
  places: z
    .object({
      id: placeId,
      dayIndex: z.number().int().nonnegative(),
      sortIndex: z.number().int().nonnegative(),
    })
    .array(),
});

export const deletePlaceSchema = z.object({
  tripId,
  placeIds: placeId.array(),
});

export type PlaceSchema = z.infer<typeof placeSchema>;
export type PlaceDetailsSchema = z.infer<typeof placeDetailsSchema>;
export type UpdatePlaceSchema = z.infer<typeof updatePlaceSchema>;
