"use client";

import { useRef, useState } from "react";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
import { useDndData } from "../dnd-itinerary";

import LocationSearchBox from "../location-search-box";

import { useAnyCloseActions } from "@/hooks/use-accessibility-features";
import { eventTemplate } from "@/data/template-data";
import { PlaceAutocompletePrediction, Event, FieldsGroup, Language, UT } from "@/types";

export default function EventComposer() {
  const { user } = useUser();
  const {
    dispatchUserTrips,
    selectedTrip,
    activeTrip,
    isEventComposerDisplayed,
    setEventComposerDisplay,
    addEventDayIndex,
  } = useDndData();

  const createEvent = api.event.create.useMutation();
  const getPlaceDetails = api.google.details.useMutation();

  // console.log(cuid2.init({ length: 14 })());

  const [sessionToken, setSessionToken] = useState(cuid2.createId());

  const ref = useRef<any>(null);
  useAnyCloseActions(ref, () => {
    if (isEventComposerDisplayed) setEventComposerDisplay(false);
  });

  const handleAddEvent = (eventData: { searchValue: string } | PlaceAutocompletePrediction) => {
    const newEvent: Event = {
      ...eventTemplate,
      id: cuid2.createId(),
      tripId: activeTrip.id,
      date: activeTrip.itinerary[addEventDayIndex].date,
      position: activeTrip.itinerary[addEventDayIndex].events.length,
      createdBy: user?.id ?? "unknown",
    };

    if ("searchValue" in eventData) {
      newEvent.name = eventData.searchValue;

      dispatchUserTrips({
        type: UT.ADD_EVENT,
        selectedTrip,
        dayIndex: addEventDayIndex,
        placeAt: "end",
        event: newEvent,
      });
    } else if (eventData.place_id) {
      newEvent.placeId = eventData.place_id;

      getPlaceDetails.mutate(
        {
          place_id: eventData.place_id,
          fields: FieldsGroup.Basic,
          language: Language.English,
          sessionToken,
        },
        {
          onSettled(data) {
            const place = data?.result || {};

            newEvent.name = place.name || newEvent.name;
            newEvent.photo = place.photos?.[0]?.photo_reference || newEvent.photo;
            newEvent.address = place.formatted_address || newEvent.address;
            newEvent.phoneNumber =
              place.formatted_phone_number || place.international_phone_number || newEvent.phoneNumber;
            newEvent.url = place.url || newEvent.url;
            newEvent.website = place.website || newEvent.website;
            newEvent.openingHours = place.opening_hours || newEvent.openingHours;

            createEvent.mutate(newEvent);
            dispatchUserTrips({
              type: UT.ADD_EVENT,
              selectedTrip,
              dayIndex: addEventDayIndex,
              placeAt: "end",
              event: newEvent,
            });
          },
        }
      );
    } else if (!eventData.place_id) {
      newEvent.name = eventData.structured_formatting.main_text;

      dispatchUserTrips({
        type: UT.ADD_EVENT,
        selectedTrip,
        dayIndex: addEventDayIndex,
        placeAt: "end",
        event: newEvent,
      });
    }

    setEventComposerDisplay(false);
    setSessionToken(cuid2.createId());
  };

  return (
    <section
      ref={ref}
      style={{
        left: 172,
        transform: `translate(0,${addEventDayIndex * 132 + 20}px)`,
      }}
      className={`absolute z-20 flex w-60 flex-col justify-end rounded-lg bg-white shadow-borderXl transition-opacity duration-300 ease-kolumb-flow  ${
        isEventComposerDisplayed ? "opacity-100" : "select-none opacity-0"
      } 
      `}
    >
      <section className={`flex flex-1 items-end justify-between p-2 pb-[10px] text-center text-sm`}>
        Event Composer
      </section>

      <LocationSearchBox
        onAdd={handleAddEvent}
        placeholder="Find interesting places"
        sessionToken={sessionToken}
      />
    </section>
  );
}
