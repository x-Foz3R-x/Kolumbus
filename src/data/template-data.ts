import { Currency } from "@prisma/client";

export const tripTemplate = {
  id: "",
  userId: "",
  name: "",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
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

  updatedAt: "",
  createdAt: "",
};
