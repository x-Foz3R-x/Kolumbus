import { createContext, useContext } from "react";
import type { PlaceSchema, UpdatePlaceSchema } from "~/lib/validations/place";

export type DndItineraryContextProps = {
  userId: string;
  tripId: string;
  placeCount: number;
  placeLimit: number;

  selectItem: (itemId: string) => void;
  createItem: (item: PlaceSchema) => void;
  updateItem: (
    item: PlaceSchema,
    updateData: UpdatePlaceSchema["data"],
    {
      dayIndex,
      entryDescription,
      preventEntry,
      preventUpdate,
    }: {
      dayIndex?: number;
      entryDescription?: string;
      preventUpdate?: boolean;
      preventEntry?: boolean;
    },
  ) => void;
  deleteItems: (itemIds: string[]) => void;
};
export const DndItineraryContext = createContext<DndItineraryContextProps | null>(null);
export const useDndItineraryContext = () => {
  const context = useContext(DndItineraryContext);
  if (context == null)
    throw new Error("DndItineraryContext must be consumed within <DndItineraryContext.Provider />");
  return context;
};
