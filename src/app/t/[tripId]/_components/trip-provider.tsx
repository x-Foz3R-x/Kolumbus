"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useHistoryState from "~/hooks/use-history-state";
import type { ItinerarySchema, PlaceSchema, TripSchema } from "~/lib/types";
import {
  MemberPermissionFlags,
  type MyMembershipSchema,
  type MemberPermissions,
} from "~/lib/validations/membership";
import { decodePermissions } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";
import { constructTrip } from "~/lib/constructors";

type TripContext = {
  userId: string;
  permissions: MemberPermissions;
  myMemberships: MyMembershipSchema[];
  setMyMemberships: (myMemberships: MyMembershipSchema[]) => void;

  trip: TripSchema;
  setTrip: (tripOrIndex: Partial<TripSchema> | number, description?: string) => void;
  setItinerary: (itineraryOrIndex: ItinerarySchema | number, desc?: string) => void;
  getMovedItemsDetails: (
    newItinerary: ItinerarySchema,
    affectedListIds: string[],
  ) => { id: string; dayIndex?: number; sortIndex?: number }[];

  createTrip: (name: string, startDate: string, endDate: string) => void;
};
export const TripContext = createContext<TripContext | null>(null);
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (context == null)
    throw new Error("useTripContext must be consumed within <TripContext.Provider />");
  return context;
};

export const TripProvider = (props: {
  userId: string;
  trip: TripSchema;
  myMemberships: MyMembershipSchema[];
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [trip, setTrip, { getEntry }] = useHistoryState(props.trip, {
    initialDescription: "Fetch",
  });
  const [myMemberships, setMyMemberships] = useState(props.myMemberships);

  const permissions = useMemo(
    () =>
      decodePermissions<MemberPermissions>(
        trip.members.find((member) => member.userId === props.userId)?.permissions ?? 0,
        MemberPermissionFlags,
      ),
    [trip.members, props.userId],
  );

  const createTrip = api.trip.create.useMutation(toastHandler("Trip created"));

  const handleCreate = useCallback(
    (name: string, startDate: string, endDate: string) => {
      const sortIndex = myMemberships.length;
      const trip = constructTrip({
        userId: props.userId,
        name,
        startDate,
        endDate,
      });

      createTrip.mutate(
        { ...trip, sortIndex },
        { onError: () => router.refresh(), onSuccess: () => router.push(`/t/${trip.id}`) },
      );
    },
    [props.userId, createTrip, myMemberships, router],
  );

  const updateTrip = useCallback(
    (tripOrIndex: Partial<TripSchema> | number, desc?: string) => {
      setTrip(
        typeof tripOrIndex === "number"
          ? tripOrIndex
          : { ...trip, ...tripOrIndex, updatedAt: new Date() },
        desc,
      );
    },
    [trip, setTrip],
  );
  const updateItinerary = useCallback(
    (itineraryOrIndex: ItinerarySchema | number, desc?: string) => {
      setTrip(
        typeof itineraryOrIndex === "number"
          ? itineraryOrIndex
          : { ...trip, updatedAt: new Date(), itinerary: itineraryOrIndex },
        desc,
      );
    },
    [trip, setTrip],
  );

  const getMovedItemsDetails = useCallback(
    (newItinerary: ItinerarySchema, affectedListIds: string[]) => {
      // Retrieves the last saved itinerary state before the current drag operation.
      // Due to a delay in history updates, the last entry (-1) reflects the previous state,
      // not the current one, making it suitable for comparison.
      const prevItinerary = getEntry(-1).itinerary;

      const getItemsFromAffectedLists = (itinerary: ItinerarySchema) => {
        return itinerary
          .filter((day) => affectedListIds.includes(day.id))
          .flatMap((day) => day.places);
      };
      const identifyMovedItems = (affectedPlaces: PlaceSchema[], prevPlaces: PlaceSchema[]) => {
        return affectedPlaces
          .filter((place) =>
            prevPlaces.some(
              (prevPlace) =>
                prevPlace.id === place.id &&
                // Check if the place's dayIndex or sortIndex has changed
                (place.dayIndex !== prevPlace.dayIndex || place.sortIndex !== prevPlace.sortIndex),
            ),
          )
          .map((place) => {
            const prevPlace = prevPlaces.find((prevPlace) => prevPlace.id === place.id)!;

            const changes: { dayIndex?: number; sortIndex?: number } = {};
            if (prevPlace.dayIndex !== place.dayIndex) changes.dayIndex = place.dayIndex;
            if (prevPlace.sortIndex !== place.sortIndex) changes.sortIndex = place.sortIndex;

            return { id: place.id, ...changes };
          });
        // .map((place) => ({ id: place.id, dayIndex: place.dayIndex, sortIndex: place.sortIndex }));
      };

      const newItems = getItemsFromAffectedLists(newItinerary);
      const prevItems = getItemsFromAffectedLists(prevItinerary);
      const movedItemsDetails = identifyMovedItems(newItems, prevItems);

      return movedItemsDetails;
    },
    [getEntry],
  );

  const value = useMemo(
    () => ({
      userId: props.userId,
      permissions,
      myMemberships,
      setMyMemberships,

      trip,
      setTrip: updateTrip,
      setItinerary: updateItinerary,
      getMovedItemsDetails,

      createTrip: handleCreate,
    }),
    [
      props.userId,
      permissions,
      myMemberships,
      trip,
      updateTrip,
      updateItinerary,
      getMovedItemsDetails,
      handleCreate,
    ],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};
