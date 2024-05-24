import { createContext, useContext } from "react";
import type { EventSchema, UpdateEventSchema } from "~/lib/validations/event";

export type DndItineraryContextProps = {
  userId: string;
  tripId: string;
  eventCount: number;
  eventLimit: number;

  selectEvent: (eventId: string) => void;
  createEvent: (event: EventSchema, dayIndex?: number, index?: number) => void;
  updateEvent: (
    event: EventSchema,
    updateData: UpdateEventSchema["data"],
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
  deleteEvents: (eventIds: string[]) => void;
};
export const DndItineraryContext = createContext<DndItineraryContextProps | null>(null);
export const useDndItineraryContext = () => {
  const context = useContext(DndItineraryContext);
  if (context == null)
    throw new Error("DndItineraryContext must be consumed within <DndItineraryContext.Provider />");
  return context;
};
