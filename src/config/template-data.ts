import { FirebaseTrip, FirebaseEvent } from "@/types";
import { formatDate } from "@/lib/utils";

interface StarterTripData {
  trip: FirebaseTrip;
  events: FirebaseEvent[];
}
export const getFirebaseStarterTrip = (): StarterTripData => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);

  const events: FirebaseEvent[] = [
    { display_name: "Eiffel Tower", date: formatDate(startDate), position: 0 },
    { display_name: "Statue of Liberty", date: formatDate(endDate), position: 0 },
    { display_name: "Palace of Culture and Science", date: formatDate(endDate), position: 1 },
  ];
  const trip: FirebaseTrip = {
    owner_id: "",
    display_name: "Welcome to Kolumbus!",
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    days: 3,
    position: 0,
    metadata: {
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  };

  return { trip, events };
};

export const tripTemplate: FirebaseTrip = {
  owner_id: "",
  display_name: "",
  start_date: formatDate(new Date()),
  end_date: formatDate(new Date()),
  days: 1,
  position: 0,
  metadata: {
    created_at: Date.now(),
    updated_at: Date.now(),
  },
};

export const eventTemplate: FirebaseEvent = {
  display_name: "",
  date: formatDate(new Date()),
  position: 0,
};
