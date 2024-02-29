import { Currency } from "@prisma/client";
import { Event } from "@/types";

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

  name: "-",
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

type EventData = {
  id: string;
  tripId: string;
  date: string;
  position: number;
  createdBy: string;
};
export function EVENT_TEMPLATE(event: EventData): Event {
  return {
    id: event.id,
    tripId: event.tripId,
    placeId: null,

    name: "-",
    address: null,
    phoneNumber: null,
    cost: null,
    currency: Currency.USD,
    website: null,
    url: null,
    note: null,
    openingHours: {},
    // photoAlbum: [],
    photo: null,

    date: event.date,
    position: event.position,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: event.createdBy,
  };
}
