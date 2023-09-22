import { Trip, Event } from "@/types";
import { FormatDate } from "@/lib/utils";

export const tripTemplate: Trip = {
  id: "",
  userId: "",
  name: "",
  startDate: FormatDate(new Date()),
  endDate: FormatDate(new Date()),
  days: 1,
  position: 0,
  itinerary: [],
  createdAt: FormatDate(new Date()),
  updatedAt: FormatDate(new Date()),
};

export const eventTemplate: Event = {
  id: "",
  tripId: "",

  name: "",
  date: FormatDate(new Date()),

  position: 0,
  createdBy: "",
  createdAt: "",
  updatedAt: "",
};
