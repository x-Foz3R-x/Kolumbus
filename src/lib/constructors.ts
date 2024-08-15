import { add } from "date-fns";

import { createId, formatDate } from "./utils";

import type { Trip } from "./validations/trip";
import type { Membership } from "./validations/membership";
import type { PlaceSchema } from "./validations/place";

export function constructTrip(trip: {
  userId: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  inviteCode?: string;
  inviteCreatedAt?: Date;
}): Trip {
  return {
    id: createId(10),
    ownerId: trip.userId,
    name: trip.name ?? "Trip to ...",
    startDate: trip.startDate ?? formatDate(new Date()),
    endDate: trip.endDate ?? formatDate(add(new Date(), { days: 4 })),
    imageUrl: trip.imageUrl ?? null,
    inviteCode: trip.inviteCode ?? null,
    inviteCreatedAt: trip.inviteCreatedAt ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function constructMembership(props: {
  userId: string;
  tripId: string;
  sortIndex: number;
  permissions?: number;
}): Membership {
  return {
    userId: props.userId,
    tripId: props.tripId,
    sortIndex: props.sortIndex,
    permissions: props.permissions ?? 0,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

export function constructPlace(place: {
  userId: string;
  tripId: string;
  googleId?: string | null;
  name?: string | null;
  address?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  note?: string | null;
  imageUrl?: string | null;
  dayIndex: number;
  sortIndex: number;
}): PlaceSchema {
  return {
    id: createId(),
    tripId: place.tripId,
    googleId: place.googleId ?? null,

    name: place.name ?? null,
    address: place.address ?? null,
    startTime: place.startTime ?? null,
    endTime: place.endTime ?? null,
    phoneNumber: place.phoneNumber ?? null,
    website: place.website ?? null,
    note: place.note ?? null,
    imageUrl: place.imageUrl ?? null,

    dayIndex: place.dayIndex,
    sortIndex: place.sortIndex,
    createdBy: place.userId,
    updatedBy: place.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function constructGoogleMapsUrl(
  placeId: string,
  placeName: string | null,
  placeAddress: string | null,
) {
  if (!placeName && !placeAddress) return null;

  const LENGTH_LIMIT = 2048;
  let query = "";

  // Prioritize address for the query parameter if available
  if (placeAddress) {
    const encodedAddress = encodeURIComponent(placeAddress);
    if (encodedAddress.length <= LENGTH_LIMIT) query = encodedAddress;
  }

  // Use name if address is not provided or exceeds length limit, and name is available
  if (!query && placeName) {
    const encodedName = encodeURIComponent(placeName);
    if (encodedName.length <= LENGTH_LIMIT) query = encodedName;
  }

  if (!query) return null;

  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${placeId}`;
}

export function constructGoogleUrl(placeName: string | null, placeAddress: string | null) {
  if (!placeName && !placeAddress) return null;

  let query = encodeURIComponent(placeName ?? "");

  if (placeName && placeAddress) {
    const nameWords = placeName.split(/[\s,]+/);
    const addressWords = placeAddress.split(/[\s,]+/);
    const nameContainsAddressWords = addressWords.some((word) => nameWords.includes(word));

    if (!nameContainsAddressWords) {
      query += `%20${encodeURIComponent(placeAddress)}`;
    }
  }

  return `https://www.google.com/search?q=${query}`;
}
