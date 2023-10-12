import { Currency } from "@prisma/client";

export const tripTemplate = {
  name: "New trip",
  startDate: new Date().toISOString(),
  endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4).toISOString(),

  // For typescript purposes to be destructed before db insert
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

  // For typescript purposes to be destructed before db insert
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};
