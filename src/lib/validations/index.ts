import { z } from "zod";

export const placeId = z.string().length(16);
export const tripId = z.string().length(10);
