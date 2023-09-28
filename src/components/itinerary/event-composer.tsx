"use client";

import React, { useEffect, useRef, useState } from "react";
import cuid2 from "@paralleldrive/cuid2";

import { useAnyCloseActions } from "@/hooks/use-accessibility-features";
import { useDndData } from "../dnd-itinerary";

import LocationSearchBox from "../location-search-box";
import { RadioIconsInline } from "../ui/radio";
import Icon from "../icons";

export default function EventComposer() {
  const {
    dispatchUserTrips,
    selectedTrip,
    activeTrip,
    isEventComposerShown,
    setEventComposerShown,
    addEventDayIndex,
  } = useDndData();

  const [sessionToken, setSessionToken] = useState(cuid2.createId());
  const [searchPlaceholder, setSearchPlaceholder] = useState("Find interesting places");
  const [eventType, setEventType] = useState("explore");
  const [placeAt, setPlaceAt] = useState("start");

  useEffect(() => {
    setSessionToken(cuid2.createId());
  }, [isEventComposerShown]);

  const ref = useRef<any>(null);
  useAnyCloseActions(ref, () => {
    if (isEventComposerShown) setEventComposerShown(false);
  });

  interface PlacePrediction {
    description: string;
    place_id: string;
    structured_formatting: { main_text: string; secondary_text: string };
    terms: { offset: number; value: string }[];
    types: string[];
  }
  // async function handleAddEvent(item: { value: string } | PlacePrediction) {
  //   const event: Event = { ...eventTemplate };
  //   event.date = activeTrip.itinerary[addEventDayIndex].date;

  //   if ("value" in item) {
  //     event.display_name = item.value;
  //   } else if ("place_id" in item) {
  //     event.display_name = item.structured_formatting.main_text;
  //     event.google = { place_id: item.place_id };

  //     interface apiData {
  //       data: {
  //         result: Place;
  //         status: string;
  //       };
  //     }
  //     const {
  //       data: { status, result },
  //     }: apiData = await axios.post("/api/details", {
  //       place_id: item.place_id,
  //       fields: PlaceFieldsGroup.Basic,
  //       language: Language.English,
  //       sessionToken,
  //     });

  //     if (status === PlacesDetailsStatus.OK && result) {
  //       if (result?.formatted_address) event.address = result.formatted_address;
  //       if (result?.website) event.website = result.website;
  //       if (result?.formatted_phone_number) event.phone_number = result.formatted_phone_number;
  //       if (result?.photos) event.google.photo_reference = result.photos[0].photo_reference;
  //       if (result?.geometry) event.google.geometry = result.geometry;
  //       if (result?.current_opening_hours) event.google.current_opening_hours = result.current_opening_hours;
  //       if (result?.url) event.google.url = result.url;
  //       if (result?.types) event.google.types = result.types;
  //     }
  //   }

  //   const docRef = await firebaseAddEvent(activeTrip.id, event);
  //   if (docRef instanceof DocumentReference) {
  //     // Successfully added the event
  //     event.id = docRef.id;
  //     dispatchUserTrips({
  //       type: UT.INSERT_EVENT,
  //       payload: {
  //         selectedTrip,
  //         dayIndex: addEventDayIndex,
  //         placeAt: "end",
  //         event,
  //       },
  //     });
  //   } else {
  //     // Handle FirestoreError
  //     // todo toast error message here
  //     console.log("Error adding event:", docRef.message);
  //     return;
  //   }

  //   setEventComposerShown(false);
  // }

  return (
    <section
      ref={ref}
      style={{
        top: addEventDayIndex * 132 + 108,
        left: 172,
      }}
      className={`absolute z-20 flex w-60 flex-col justify-end rounded-lg bg-white shadow-borderXl duration-300 ease-kolumb-flow ${
        isEventComposerShown ? "opacity-100" : "hidden select-none opacity-0"
      }`}
    >
      <section className={`flex flex-1 items-end justify-between p-2 pb-[10px] text-center text-sm`}>
        {/* <RadioIconsInline
          title="type"
          name="event_type"
          setValue={setSearchPlaceholder}
          options={[
            {
              display_name: "explore",
              value: "Find interesting places",
              element: <Icon.explore className="h-4 w-4 p-px" />,
            },
            {
              display_name: "food",
              value: "Find a place to eat",
              element: <Icon.forkKnife className="h-4 w-4 py-px" />,
            },
            {
              display_name: "accommodation",
              value: "Find a place to stay",
              element: <Icon.bed className="h-4 w-4" />,
            },
            {
              display_name: "transportation",
              value: "Find destination point",
              element: <Icon.carPlane className="h-4 w-[18px]" />,
            },
          ]}
        /> */}

        {/* <RadioIconsInline
          title="place at"
          name="event_placement"
          setValue={setPlaceAt}
          options={[
            {
              display_name: "start",
              element: <Icon.x className="h-4 w-4 p-[2px]" />,
            },
            {
              display_name: "end",
              element: <Icon.x className="h-4 w-4 p-[2px]" />,
            },
          ]}
        /> */}
      </section>

      <LocationSearchBox onAdd={() => {}} placeholder={searchPlaceholder} sessionToken={sessionToken} />
    </section>
  );
}
