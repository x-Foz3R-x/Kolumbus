import { z } from "zod";

import { selectPlaceSchema as place } from "~/server/db/schema";
import { placeId, tripId } from ".";

export const placeSchema = place;

export const placeDetailsSchema = place.omit({
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
  places: z.array(
    z.object({
      id: placeId,
      dayIndex: z.number().int().nonnegative(),
      sortIndex: z.number().int().nonnegative(),
    }),
  ),
});

export const deletePlaceSchema = z.object({
  tripId,
  placeIds: z.array(placeId),
});

export type PlaceSchema = z.infer<typeof placeSchema>;
export type PlaceDetailsSchema = z.infer<typeof placeDetailsSchema>;
export type UpdatePlaceSchema = z.infer<typeof updatePlaceSchema>;
