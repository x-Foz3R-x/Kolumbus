"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata-provider";
import type { Itinerary } from "@/types";

import { DndItinerary, onEventCreated, onEventUpdated, onEventDeleted } from "@/components/dnd-itinerary";
import ActionBar from "@/components/itinerary/action-bar";
import { ActionBarSkeleton, ItinerarySkeleton } from "@/components/skeletons";

export default function Itinerary({ params: { tripId } }: { params: { tripId: string } }) {
  const { user } = useUser();
  const { userTrips, setSelectedTrip, isLoading } = useAppdata();

  const eventCreate = api.event.create.useMutation();
  const eventUpdate = api.event.update.useMutation();
  const eventDelete = api.event.delete.useMutation();

  const [isSaving, setSaving] = useState(false);

  const activeTrip = useMemo(() => userTrips.find((trip) => trip.id === tripId), [userTrips, tripId]);
  const selectedTripIndex = useMemo(() => userTrips.findIndex((trip) => trip.id === tripId), [userTrips, tripId]);

  const handleEventCreated: onEventCreated = (event, handleError) => {
    setSaving(true);
    eventCreate.mutate(event, {
      onError: handleError,
      onSettled: () => setSaving(false),
    });
  };

  const handleEventUpdated: onEventUpdated = (eventId, tripId, eventData, handleError) => {
    setSaving(true);
    eventUpdate.mutate(
      { eventId, tripId, data: eventData },
      {
        onError: handleError,
        onSettled: () => setSaving(false),
      },
    );
  };

  const handleEventDeleted: onEventDeleted = (eventId, tripId, handleError) => {
    setSaving(true);
    eventDelete.mutate({ eventId, tripId }, { onError: handleError, onSettled: () => setSaving(false) });
  };

  useEffect(() => {
    setSelectedTrip(selectedTripIndex);
  }, [setSelectedTrip, selectedTripIndex]);

  return !isLoading && user && activeTrip ? (
    <>
      {/* This span ensures that action bar isn't first to focus and the warning about position sticky disappears */}
      <span />
      <ActionBar activeTrip={activeTrip} isSaving={isSaving} setSaving={setSaving} />
      <div className="relative mt-28 px-2 pt-3 font-inter">
        <DndItinerary
          userId={user.id}
          tripId={tripId}
          itinerary={activeTrip.itinerary}
          setSaving={setSaving}
          onEventCreated={handleEventCreated}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
        />
      </div>
    </>
  ) : (
    <>
      <ActionBarSkeleton />
      <ItinerarySkeleton />
    </>
  );
}
