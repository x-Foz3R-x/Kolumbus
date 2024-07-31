import { z } from "zod";

import { selectPlaceSchema as place } from "~/server/db/schema";

export const deletePlaceSchema = z.object({
  id: z.string().length(16),
  tripId: z.string().length(10),
  dayIndex: z.number().int().nonnegative(),
  sortIndex: z.number().int().nonnegative(),
  createdBy: z.string().optional(),
});

export const placeSchema = place;

export const updatePlaceSchema = z.object({
  id: z.string().length(16),
  tripId: z.string().length(10),
  data: place.partial(),
});

export type Place = z.infer<typeof place>;
export type PlaceSchema = z.infer<typeof placeSchema>;
export type UpdatePlaceSchema = z.infer<typeof updatePlaceSchema>;
