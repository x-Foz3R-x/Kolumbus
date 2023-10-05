import { Trip, Event } from "@/types";

export const tripTemplate: Trip = {
  id: "",
  userId: "",
  name: "",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  days: 1,
  position: 0,
  itinerary: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const eventTemplate: Event = {
  id: "",
  tripId: "",

  name: "",
  date: new Date().toISOString(),
  address: null,
  cost: null,
  phoneNumber: null,
  website: null,
  note: null,
  photo: null,

  type: "DEFAULT",
  place: null,
  placeId: null,

  position: 0,
  createdBy: "",
  createdAt: "",
  updatedAt: "",
};
