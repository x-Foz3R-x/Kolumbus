"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useHistoryState from "~/hooks/use-history-state";
import type { ItinerarySchema, TripSchema } from "~/lib/validations/trip";
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
  trip: TripSchema;
  setTrip: (tripOrIndex: TripSchema | number, description?: string) => void;
  myMemberships: MyMembershipSchema[];
  setMyMemberships: (myMemberships: MyMembershipSchema[]) => void;

  userId: string;
  permissions: MemberPermissions;

  updateItinerary: (itineraryOrIndex: ItinerarySchema | number, desc?: string) => void;
  getItineraryEntry: (index: number) => ItinerarySchema;

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
  const getItineraryEntry = useCallback(
    (index: number) => {
      return getEntry(index).itinerary;
    },
    [getEntry],
  );

  const value = useMemo(
    () => ({
      trip,
      setTrip,
      myMemberships,
      setMyMemberships,

      userId: props.userId,
      permissions,

      updateItinerary,
      getItineraryEntry,

      createTrip: handleCreate,
    }),
    [
      props.userId,
      trip,
      permissions,
      setTrip,
      myMemberships,
      updateItinerary,
      getItineraryEntry,
      handleCreate,
    ],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};
