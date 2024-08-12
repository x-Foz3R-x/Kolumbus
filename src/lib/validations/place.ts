import { z } from "zod";

import { selectPlaceSchema as place } from "~/server/db/schema";
import { placeId, tripId } from ".";

export const placeSchema = place;

export const updatePlaceSchema = z.object({
  id: placeId,
  tripId,
  data: place.partial(),
});

export const updatePlacementSchema = z.object({
  tripId,
  items: z.array(
    z.object({
      id: placeId,
      dayIndex: z.number().int().nonnegative(),
      sortIndex: z.number().int().nonnegative(),
    }),
  ),
});

export const deletePlaceSchema = z.object({
  id: placeId,
  tripId,
  dayIndex: z.number().int().nonnegative(),
  sortIndex: z.number().int().nonnegative(),
});

export type Place = z.infer<typeof place>;
export type PlaceSchema = z.infer<typeof placeSchema>;
export type UpdatePlaceSchema = z.infer<typeof updatePlaceSchema>;
