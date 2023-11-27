"use client";

import { useRef, useState } from "react";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
import { useDndData } from "../dnd-itinerary";

import useCloseTriggers from "@/hooks/use-close-triggers";
import { eventTemplate } from "@/data/template-data";
import { PlaceAutocompletePrediction, Event, FieldsGroup, Language, UT } from "@/types";
import useAppdata from "@/context/appdata";

import LocationSearchBox from "../location-search-box";
import { Motion, Popover, Position } from "../ui/popover";
import { TRANSITION } from "@/lib/framer-motion";

export default function EventComposer() {
  const { user } = useUser();
  const { dispatchUserTrips, selectedTrip, setSaving } = useAppdata();
  const { activeTrip, isEventComposerOpen, setEventComposerOpen, itineraryPosition } = useDndData();

  const createEvent = api.event.create.useMutation();
  const getPlaceDetails = api.google.details.useMutation();

  const [isOpen, setOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState(cuid2.createId());

  const ref = useRef<HTMLDivElement>(null);
  useCloseTriggers([ref], () => isEventComposerOpen && setEventComposerOpen(false));

  /**
   * Handles the addition of an event to the itinerary.
   * @param eventData - The data for the event to be added. It can be either a string or a PlaceAutocompletePrediction object.
   */
  const handleAddEvent = (eventData: string | PlaceAutocompletePrediction) => {
    const event: Event = {
      ...eventTemplate,
      id: cuid2.createId(),
      tripId: activeTrip.id,
      date: activeTrip.itinerary[itineraryPosition.y_day].date,
      position: activeTrip.itinerary[itineraryPosition.y_day].events.length,
      createdBy: user?.id ?? "unknown",
    };

    if (typeof eventData === "string") {
      event.name = eventData;

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
            payload: { tripIndex: selectedTrip, dayIndex: itineraryPosition.y_day, event: { ...event, ...(updatedEvent as Event | any) } },
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
                    event: { ...event, ...(updatedEvent as Event | any) },
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
            payload: { tripIndex: selectedTrip, dayIndex: itineraryPosition.y_day, event: { ...event, ...(updatedEvent as Event | any) } },
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

    setEventComposerOpen(false);
    setSessionToken(cuid2.createId());
  };

  return (
    <Popover
      popoverRef={ref}
      isOpen={isEventComposerOpen}
      setOpen={setEventComposerOpen}
      container={{ selector: "main > div ", margin: [56, 0, 0, 224], padding: [56, 12, 0, 12] }}
      extensions={[Position(172, itineraryPosition.y_day * 132 + 20, "left"), Motion(TRANSITION.fadeInScale)]}
      className={`z-20 flex w-60 flex-col rounded-lg bg-white shadow-borderXL duration-500 ease-kolumb-flow ${isOpen && "rounded-b-none"}`}
    >
      <span className="w-full p-2 text-center text-sm font-medium text-gray-600">Event Composer</span>

      <LocationSearchBox
        isOpen={isOpen}
        setOpen={setOpen}
        onAdd={handleAddEvent}
        placeholder="Search or enter name"
        sessionToken={sessionToken}
      />
    </Popover>
  );
}
