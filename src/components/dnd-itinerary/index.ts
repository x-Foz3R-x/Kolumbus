import type { PlaceSchema, UpdatePlaceSchema } from "~/lib/validations/place";

export { DndItinerary } from "./dnd-itinerary";

export type onItemCreate = (item: PlaceSchema) => void;
export type onItemUpdate = (
  tripId: string,
  itemId: string,
  itemData: UpdatePlaceSchema["data"],
) => void;
export type onItemsMove = (
  tripId: string,
  items: { id: string; dayIndex: number; sortIndex: number }[],
) => void;
export type onItemsDelete = (tripId: string, itemIds: string | string[]) => void;
