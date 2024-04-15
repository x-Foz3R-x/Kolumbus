"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { cloneDeep } from "lodash";

import api from "@/app/_trpc/client";
import { createId } from "@/db/utils";
import { MEMBERSHIP_TEMPLATE, TRIP_TEMPLATE } from "@/data/template-data";
import { ExtendedMembership } from "@/types";

type LibraryContext = {
  tripMemberships: ExtendedMembership[];
  sharedTripMemberships: ExtendedMembership[];
  isLoading: boolean;
  isSaving: boolean;
  createTrip: (name: string) => void;
  duplicateTrip: (id: string) => void;
  leaveTrip: (id: string) => void;
  deleteTrip: (id: string) => void;
};
const libraryContext = createContext<LibraryContext | null>(null);
export default function useLibraryContext() {
  const context = useContext(libraryContext);
  if (!context) throw new Error("useLibraryContext must be used within a LibraryProvider");
  return context;
}

// todo: share trip

type Props = { memberships: ExtendedMembership[]; children: React.ReactNode };
export function LibraryProvider({ memberships, children }: Props) {
  const { user } = useUser();

  const [tripMemberships, setTripMemberships] = useState(memberships.filter((membership) => membership.owner));
  const [sharedTripMemberships, setSharedTripMemberships] = useState(memberships.filter((membership) => !membership.owner));
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const createTripApi = api.trips.create.useMutation();
  const duplicateTripApi = api.trips.duplicate.useMutation();
  const leaveTripApi = api.trips.leave.useMutation();
  const deleteTripApi = api.trips.delete.useMutation();

  const createTrip = useCallback(
    (name: string) => {
      if (!user) return;

      const newTripPosition = tripMemberships.length;

      const newTrip = TRIP_TEMPLATE({ id: createId(12), ownerId: user.id, name });
      const newMembership = MEMBERSHIP_TEMPLATE({ userId: user.id, tripId: newTrip.id, tripPosition: newTripPosition, owner: true });

      const newExtendedMembership: ExtendedMembership = {
        ...newMembership,
        trip: {
          name: newTrip.name,
          startDate: newTrip.startDate,
          endDate: newTrip.endDate,
          photo: newTrip.photo,
          events: [],
          eventCount: 0,
        },
      };

      setTripMemberships((memberships) => [...memberships, newExtendedMembership]);
      createTripApi.mutate(
        { ...newTrip, position: newTripPosition },
        {
          onError(error) {
            console.error(error.message);
            setTripMemberships((memberships) => memberships.filter((m) => m.tripId !== newTrip.id));
          },
        },
      );
    },
    [user, createTripApi, tripMemberships],
  );
  const duplicateTrip = useCallback(
    (id: string) => {
      if (!user) return;

      // Find the membership to duplicate
      const originalMembership = tripMemberships.find((membership) => membership.tripId === id);

      if (!originalMembership) return;

      // Create a clone of the trip memberships
      const tripMembershipsClone = cloneDeep(tripMemberships);

      // Create a duplicate of the original membership
      const duplicatedMembership = cloneDeep(originalMembership);

      // Update the duplicated membership with a new tripId, incremented tripPosition, and new timestamps
      duplicatedMembership.tripId = createId(12);
      duplicatedMembership.tripPosition += 1;
      duplicatedMembership.createdAt = new Date();
      duplicatedMembership.updatedAt = new Date();

      // Create a copy of the current memberships and update the tripPosition of memberships
      const newMemberships = [...tripMemberships].map((membership) =>
        membership.tripPosition >= duplicatedMembership.tripPosition
          ? { ...membership, tripPosition: membership.tripPosition + 1 }
          : membership,
      );

      // Insert the duplicated membership at its tripPosition in the array
      newMemberships.splice(duplicatedMembership.tripPosition, 0, duplicatedMembership);

      // Update the state with the new list of memberships
      setTripMemberships(newMemberships);

      duplicateTripApi.mutate(
        { id, newId: duplicatedMembership.tripId },
        {
          onError(error) {
            console.error(error.message);
            setTripMemberships(tripMembershipsClone);
          },
        },
      );
    },
    [user, duplicateTripApi, tripMemberships],
  );
  const leaveTrip = useCallback(
    (id: string) => {
      if (!user) return;

      const membershipClone = cloneDeep(sharedTripMemberships);
      const tripPosition = sharedTripMemberships.find((membership) => membership.tripId === id)?.tripPosition;

      if (tripPosition === undefined) return;

      const updatedMemberships = sharedTripMemberships
        .filter((membership) => membership.tripId !== id)
        .map((membership) =>
          membership.tripPosition > tripPosition ? { ...membership, tripPosition: membership.tripPosition - 1 } : membership,
        );

      setSharedTripMemberships(updatedMemberships);

      leaveTripApi.mutate(
        { tripId: id },
        {
          onError(error) {
            console.error(error.message);
            setSharedTripMemberships(membershipClone);
          },
        },
      );
    },
    [user, leaveTripApi, sharedTripMemberships],
  );
  const deleteTrip = useCallback(
    (id: string) => {
      if (!user) return;

      const membershipClone = cloneDeep(tripMemberships);
      const deletedTripPosition = tripMemberships.find((membership) => membership.tripId === id)?.tripPosition;

      if (deletedTripPosition === undefined) return;

      const updatedMemberships = tripMemberships
        .filter((membership) => membership.tripId !== id)
        .map((membership) =>
          membership.tripPosition > deletedTripPosition ? { ...membership, tripPosition: membership.tripPosition - 1 } : membership,
        );

      setTripMemberships(updatedMemberships);

      deleteTripApi.mutate(
        { tripId: id },
        {
          onError(error) {
            console.error(error.message);
            setTripMemberships(membershipClone);
          },
        },
      );
    },
    [user, deleteTripApi, tripMemberships],
  );

  // Keep memberships up to date with db
  useEffect(() => {
    setTripMemberships(memberships.filter((membership) => membership.owner));
    setSharedTripMemberships(memberships.filter((membership) => !membership.owner));
  }, [memberships]);

  // Handle loading state
  useEffect(() => {
    if (isLoading === true && tripMemberships && tripMemberships.length > 0) setLoading(false);
  }, [tripMemberships, isLoading]);

  // Handle saving state
  useEffect(() => {
    const isLoading = [createTripApi.status, duplicateTripApi.status, deleteTripApi.status].some((status) => status === "loading");
    setSaving(isLoading);
  }, [createTripApi.status, duplicateTripApi.status, deleteTripApi.status]);

  const value = useMemo(
    () => ({
      tripMemberships,
      sharedTripMemberships,
      isLoading,
      isSaving,
      createTrip,
      duplicateTrip,
      leaveTrip,
      deleteTrip,
    }),
    [tripMemberships, sharedTripMemberships, isLoading, isSaving, createTrip, duplicateTrip, leaveTrip, deleteTrip],
  );

  return <libraryContext.Provider value={value}>{children}</libraryContext.Provider>;
}
