import { Trip } from "@/types";

export const fallbackTrip: Trip = {
  id: "",
  owner_id: "",
  participants_id: [],
  name: "ERROR",
  start_date: "",
  end_date: "",
  days: 0,
  position: 69,
  itinerary: [],
  created_at: Date.now(),
  updated_at: Date.now(),
};
