import { createContext, useContext } from "react";
import { Itinerary } from "@/types";

export type DndItineraryContextProps = {
  userId: string;
  tripId: string;
  eventsCount: number;
  getItineraryClone: () => Itinerary;
  selectEvent: (eventId: string) => void;
  deleteEvents: (eventIds: string[]) => void;
};
export const DndItineraryContext = createContext<DndItineraryContextProps | null>(null);
export const useDndItineraryContext = () => {
  const context = useContext(DndItineraryContext);
  if (context == null) throw new Error("DndItineraryContext must be consumed within <DndItineraryContext.Provider />");
  return context;
};
