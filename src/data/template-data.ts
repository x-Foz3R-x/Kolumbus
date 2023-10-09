import { Trip, Event } from "@/types";
import { Currency, EventType } from "@prisma/client";

export const tripTemplate: Trip = {
  id: "",
  userId: "",
  name: "",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  days: 1,
  position: 0,
  itinerary: [],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const eventTemplate = {
  placeId: null,

  name: null,
  cost: null,
  currency: Currency.USD,
  note: null,
  photo: null,
  photoAlbum: [],

  address: null,
  phoneNumber: null,
  url: null,
  website: null,
  openingHours: {},

  type: EventType.DEFAULT,
  updatedAt: "",
  createdAt: "",
};
