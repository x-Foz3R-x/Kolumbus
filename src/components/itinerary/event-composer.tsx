"use client";

import { useRef, useState } from "react";
import cuid2 from "@paralleldrive/cuid2";

import LocationSearchBox from "../location-search-box";

import api from "@/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
import { useDndData } from "../dnd-itinerary";

import { useCloseTriggers } from "@/hooks/use-accessibility-features";
import { eventTemplate } from "@/data/template-data";
import { PlaceAutocompletePrediction, Event, FieldsGroup, Language, UT } from "@/types";
import useAppdata from "@/context/appdata";
import { cn } from "@/lib/utils";

export default function EventComposer() {
  const { user } = useUser();
  const { dispatchUserTrips, selectedTrip, setSaving } = useAppdata();
  const { activeTrip, isEventComposerDisplayed, setEventComposerDisplay, itineraryPosition } = useDndData();

  const createEvent = api.event.create.useMutation();
  const getPlaceDetails = api.google.details.useMutation();

  const [isOpen, setOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState(cuid2.createId());

  const ref = useRef<HTMLElement>(null);
  useCloseTriggers([ref], () => isEventComposerDisplayed && setEventComposerDisplay(false));

  /**
   * Handles adding a new event to the itinerary.
   * @param eventData - The data for the new event, either a search value or a PlaceAutocompletePrediction.
   */
  const handleAddEvent = (eventData: { searchValue: string } | PlaceAutocompletePrediction) => {
    const event: Event = {
      ...eventTemplate,
      id: cuid2.createId(),
      tripId: activeTrip.id,
      date: activeTrip.itinerary[itineraryPosition.y_day].date,
      position: activeTrip.itinerary[itineraryPosition.y_day].events.length,
      createdBy: user?.id ?? "unknown",
    };

    setSaving(true);
    if ("searchValue" in eventData) {
      event.name = eventData.searchValue;

      setSaving(true);
      dispatchUserTrips({
        type: UT.CREATE_EVENT,
        payload: { tripIndex: selectedTrip, dayIndex: itineraryPosition.y_day, event, placeAt: "end" },
      });
      createEvent.mutate(event, {
        onSuccess(updatedEvent) {
          if (!updatedEvent) return;
          dispatchUserTrips({
            type: UT.UPDATE_EVENT,
            payload: { tripIndex: selectedTrip, dayIndex: itineraryPosition.y_day, event: { ...event, ...(updatedEvent as Event) } },
          });
        },
        onError(error) {
          console.error(error);
          dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
        },
        onSettled() {
          setSaving(false);
        },
      });
    } else if (eventData.place_id) {
      event.placeId = eventData.place_id;

      setSaving(true);
      getPlaceDetails.mutate(
        {
          place_id: eventData.place_id,
          fields: FieldsGroup.Basic + FieldsGroup.Contact,
          language: Language.English,
          sessionToken,
        },
        {
          onSuccess(data) {
            const place = data?.result ?? {};

            event.name = place.name ?? event.name;
            event.photo = place.photos?.[0]?.photo_reference ?? event.photo;
            event.address = place.formatted_address ?? event.address;
            event.phoneNumber = place.international_phone_number ?? place.formatted_phone_number ?? event.phoneNumber;
            event.url = place.url ?? event.url;
            event.website = place.website ?? event.website;
            event.openingHours = place.opening_hours ?? event.openingHours;

            dispatchUserTrips({
              type: UT.CREATE_EVENT,
              payload: { tripIndex: selectedTrip, dayIndex: itineraryPosition.y_day, event, placeAt: "end" },
            });
            createEvent.mutate(event, {
              onSuccess(updatedEvent) {
                if (!updatedEvent) return;
                dispatchUserTrips({
                  type: UT.UPDATE_EVENT,
                  payload: {
                    tripIndex: selectedTrip,
                    dayIndex: itineraryPosition.y_day,
                    event: { ...event, ...(updatedEvent as Event) },
                  },
                });
              },
              onError(error) {
                console.error(error);
                dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
              },
            });
          },
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
          },
          onSettled() {
            setSaving(false);
          },
        },
      );
    } else if (!eventData.place_id) {
      event.name = eventData.structured_formatting.main_text;

      setSaving(true);
      dispatchUserTrips({
        type: UT.CREATE_EVENT,
        payload: { tripIndex: selectedTrip, dayIndex: itineraryPosition.y_day, event, placeAt: "end" },
      });
      createEvent.mutate(event, {
        onSuccess(updatedEvent) {
          if (!updatedEvent) return;
          dispatchUserTrips({
            type: UT.UPDATE_EVENT,
            payload: { tripIndex: selectedTrip, dayIndex: itineraryPosition.y_day, event: { ...event, ...(updatedEvent as Event) } },
          });
        },
        onError(error) {
          console.error(error);
          dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
        },
        onSettled() {
          setSaving(false);
        },
      });
    }

    setEventComposerDisplay(false);
    setSessionToken(cuid2.createId());
  };

  return (
    <section
      ref={ref}
      style={{ left: 172, transform: `translateY(${itineraryPosition.y_day * 132 + 20}px)` }}
      className={cn(
        "absolute z-20 flex w-60 flex-col justify-end rounded-lg bg-white shadow-borderXL duration-300 ease-kolumb-flow",
        isEventComposerDisplayed ? "opacity-100" : "pointer-events-none select-none opacity-0",
        isOpen && "rounded-b-none",
      )}
    >
      <section className="flex flex-1 items-end justify-between p-2 pb-[10px] text-center text-sm">Event Composer</section>

      <LocationSearchBox
        isOpen={isOpen}
        setOpen={setOpen}
        onAdd={handleAddEvent}
        placeholder="Find interesting places"
        sessionToken={sessionToken}
      />
    </section>
  );
}
