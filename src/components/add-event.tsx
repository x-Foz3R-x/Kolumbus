"use client";

import React, { useRef, useState } from "react";

import useEventOperations from "@/hooks/use-event-operations";
import { useEscapeOrOutsideClose } from "@/hooks/use-accessibility-features";
import { useDndData } from "./dnd-itinerary";
import { eventTemplate } from "@/config/template-data";
import { UT } from "@/types";

import Icon from "./icons";
import GooglePlaceAutocomplete from "./google-place-autocomplete";
import { RadioIconsInline } from "./ui/radio";
import { DocumentReference } from "firebase/firestore";

export default function AddEvent() {
  const { dispatchUserTrips, selectedTrip, activeTrip, isAddEventShown, setAddEventShown, addEventDayIndex } =
    useDndData();
  const { addEvent } = useEventOperations(activeTrip.id);

  const [searchPlaceholder, setSearchPlaceholder] = useState("Find interesting places");
  // const [eventType, setEventType] = useState("explore");
  const [placeAt, setPlaceAt] = useState("start");

  const ref = useRef<any>(null);
  useEscapeOrOutsideClose(ref, () => {
    if (isAddEventShown) setAddEventShown(false);
  });

  interface EventWithPlaceId {
    place_id: string;
    structured_formatting: { main_text: string };
  }
  async function onAddEvent(data: { value: string } | EventWithPlaceId) {
    const event = { ...eventTemplate };
    event.date = activeTrip.itinerary[addEventDayIndex].date;

    if ("value" in data) {
      event.display_name = data.value;
    } else if ("place_id" in data) {
      event.display_name = data.structured_formatting.main_text;
      event.google_place = { place_id: data.place_id };
    }

    const docRef = await addEvent(event);
    if (docRef instanceof DocumentReference) {
      // Successfully added the event
      dispatchUserTrips({
        type: UT.INSERT_EVENT,
        payload: {
          selectedTrip,
          dayIndex: addEventDayIndex,
          placeAt: "end",
          event: { id: docRef.id, ...event },
        },
      });
    } else {
      // Handle FirestoreError
      // todo toast error message here
      console.log("Error adding event:", docRef.message);
      return;
    }

    setAddEventShown(false);
  }

  return isAddEventShown ? (
    <div
      ref={ref}
      style={{
        top: addEventDayIndex * 132 + 108,
        left: 180,
      }}
      className="absolute z-30 flex w-60 flex-col justify-end rounded-lg bg-white shadow-xl duration-300 ease-kolumb-flow"
    >
      <section className={`flex flex-1 items-end justify-between p-2 pb-[10px] text-center text-sm`}>
        <RadioIconsInline
          title="type"
          name="event_type"
          setValue={setSearchPlaceholder}
          options={[
            {
              name: "explore",
              value: "Find interesting places",
              element: <Icon.explore className="h-4 w-4 p-px" />,
            },
            {
              name: "food",
              value: "Find a place to eat",
              element: <Icon.forkKnife className="h-4 w-4 py-px" />,
            },
            {
              name: "accommodation",
              value: "Find a place to stay",
              element: <Icon.bed className="h-4 w-4" />,
            },
            {
              name: "transportation",
              value: "Find destination point",
              element: <Icon.carPlane className="h-4 w-[18px]" />,
            },
          ]}
        />

        <RadioIconsInline
          title="place at"
          name="event_placement"
          setValue={setPlaceAt}
          options={[
            {
              name: "start",
              element: <Icon.x className="h-4 w-4 p-[2px]" />,
            },
            {
              name: "end",
              element: <Icon.x className="h-4 w-4 p-[2px]" />,
            },
          ]}
        />
      </section>

      <GooglePlaceAutocomplete onAdd={onAddEvent} placeholder={searchPlaceholder} />
    </div>
  ) : (
    <></>
  );
}
