import { createContext, useContext } from "react";
import type { Event } from "~/lib/validations/event";

export type DndItineraryContextProps = {
  userId: string;
  tripId: string;
  eventCount: number;
  eventLimit: number;

  selectEvent: (eventId: string) => void;
  // createEvent: (event: Event, dayIndex?: number, index?: number) => void;
  // updateEvent: (
  //   event: Event,
  //   cache: Event,
  //   {
  //     dayIndex,
  //     entryDescription,
  //     preventEntry,
  //     preventUpdate,
  //   }: {
  //     dayIndex?: number;
  //     entryDescription?: string;
  //     preventUpdate?: boolean;
  //     preventEntry?: boolean;
  //   },
  // ) => void;
  // deleteEvents: (eventIds: string[]) => void;
};
export const DndItineraryContext = createContext<DndItineraryContextProps | null>(null);
export const useDndItineraryContext = () => {
  const context = useContext(DndItineraryContext);
  if (context == null)
    throw new Error("DndItineraryContext must be consumed within <DndItineraryContext.Provider />");
  return context;
};
