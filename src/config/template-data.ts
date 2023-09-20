import { Trip, Event } from "@/types";
import { FormatDate } from "@/lib/utils";

interface StarterTripData {
  trip: Trip;
  events: Event[];
}
export const getFirebaseStarterTrip = (): StarterTripData => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);

  const events: Event[] = [
    { id: "e0", display_name: "Eiffel Tower", date: FormatDate(startDate), position: 0, drag_type: "event" },
    {
      id: "e1",
      display_name: "Statue of Liberty",
      date: FormatDate(endDate),
      position: 0,
      drag_type: "event",
    },
    {
      id: "e2",
      display_name: "Palace of Culture and Science",
      date: FormatDate(endDate),
      position: 1,
      drag_type: "event",
    },
  ];
  const trip: Trip = {
    id: "",
    owner_id: "",
    display_name: "Welcome to Kolumbus!",
    startDate: FormatDate(startDate),
    end_date: FormatDate(endDate),
    days: 3,
    position: 0,
    itinerary: [],
    metadata: {
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  };

  return { trip, events };
};

export const tripTemplate: Trip = {
  id: "",
  owner_id: "",
  display_name: "",
  startDate: FormatDate(new Date()),
  end_date: FormatDate(new Date()),
  days: 1,
  position: 0,
  itinerary: [],
  metadata: {
    created_at: Date.now(),
    updated_at: Date.now(),
  },
};

export const eventTemplate: Event = {
  id: "",
  display_name: "",
  date: FormatDate(new Date()),
  position: 0,
  drag_type: "event",
};
