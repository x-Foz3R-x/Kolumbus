"use client";

import React, { useEffect, useRef, useState } from "react";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
import { useDndData } from "../dnd-itinerary";

import LocationSearchBox from "../location-search-box";

import { useAnyCloseActions } from "@/hooks/use-accessibility-features";
import { eventTemplate } from "@/config/template-data";
import { PlaceAutocompletePrediction, Event, Place, FieldsGroup, Language, PlaceSchema, UT } from "@/types";

export default function EventComposer() {
  const { user } = useUser();
  const {
    dispatchUserTrips,
    selectedTrip,
    activeTrip,
    isEventComposerShown,
    setEventComposerShown,
    addEventDayIndex,
  } = useDndData();

  const getDetails = api.google.details.useMutation();
  const addPlace = api.place.add.useMutation();

  // console.log(cuid2.init({ length: 14 })());

  const [sessionToken, setSessionToken] = useState(cuid2.createId());

  // useEffect(() => {
  //   setSessionToken(cuid2.createId());
  // }, [isEventComposerShown]);

  const ref = useRef<any>(null);
  useAnyCloseActions(ref, () => {
    if (isEventComposerShown) setEventComposerShown(false);
  });

  type EventData = { searchValue: string } | PlaceAutocompletePrediction;
  async function handleAddEvent(eventData: EventData) {
    const newEvent: Event = { ...eventTemplate };
    newEvent.date = activeTrip.itinerary[addEventDayIndex].date;
    newEvent.createdBy = user?.id ?? "unknown";

    if ("searchValue" in eventData) {
      newEvent.id = cuid2.createId();
      newEvent.name = eventData.searchValue;
    } else if ("place_id" in eventData) {
      newEvent.id = cuid2.createId();
      newEvent.name = eventData.structured_formatting.main_text;

      if (typeof eventData.place_id !== "undefined") {
        const newPlace: Place = { placeId: eventData.place_id, types: [] };
        newEvent.placeId = eventData.place_id;

        getDetails.mutate(
          {
            place_id: eventData.place_id,
            fields: FieldsGroup.Basic,
            language: Language.English,
            sessionToken,
          },
          {
            onSettled(data) {
              if (typeof data === "undefined") return;

              if ("result" in data) {
                const details = data.result;

                if (details?.name) newEvent.name = details.name;
                if (details?.formatted_address) newEvent.address = details.formatted_address;
                if (details?.international_phone_number)
                  newEvent.phoneNumber = details.international_phone_number;
                if (details?.formatted_phone_number) newEvent.phoneNumber = details.formatted_phone_number;
                if (details?.url) newEvent.website = details.url;
                if (details?.website) newEvent.website = details.website;

                //#region place
                details.types?.forEach((type) => newPlace.types.push({ name: type }));
                newPlace.name = details.name;
                newPlace.address = details.formatted_address;
                newPlace.addressComponents = details.address_components;
                newPlace.photoReference = details.photos?.[0].photo_reference;
                newPlace.photos = details.photos;
                newPlace.url = details.url;
                newPlace.website = details.website;
                newPlace.phoneNumber = details.formatted_phone_number;
                newPlace.internationalPhoneNumber = details.international_phone_number;
                newPlace.rating = details.rating;
                newPlace.userRatingsTotal = details.user_ratings_total;
                newPlace.priceLevel = details.price_level;
                newPlace.businessStatus = details.business_status;
                newPlace.currentOpeningHours = details.current_opening_hours;
                newPlace.openingHours = details.opening_hours;
                newPlace.secondaryOpeningHours = details.secondary_opening_hours;
                newPlace.editorialSummary = details.editorial_summary;
                newPlace.reviews = details.reviews;
                newPlace.vicinity = details.vicinity;
                newPlace.geometry = details.geometry;
                newPlace.utcOffset = details.utc_offset;
                newPlace.curbsidePickup = details.curbside_pickup;
                newPlace.delivery = details.delivery;
                newPlace.dineIn = details.dine_in;
                newPlace.reservable = details.reservable;
                newPlace.servesBeer = details.serves_beer;
                newPlace.servesBreakfast = details.serves_breakfast;
                newPlace.servesBrunch = details.serves_brunch;
                newPlace.servesDinner = details.serves_dinner;
                newPlace.servesLunch = details.serves_lunch;
                newPlace.servesVegetarianFood = details.serves_vegetarian_food;
                newPlace.servesWine = details.serves_wine;
                newPlace.takeout = details.takeout;
                newPlace.wheelchairAccessibleEntrance = details.wheelchair_accessible_entrance;
                //#endregion

                newEvent.place = newPlace;
                addPlace.mutate(newPlace);
              }

              if ("placeId" in data) newEvent.place = data;
            },
          }
        );
      }

      console.log(newEvent);

      dispatchUserTrips({
        type: UT.ADD_EVENT,
        selectedTrip,
        dayIndex: addEventDayIndex,
        placeAt: "end",
        event: newEvent,
      });
    }

    // if (docRef instanceof DocumentReference) {
    //   // Successfully added the event
    //   dispatchUserTrips({
    //     type: UT.INSERT_EVENT,
    //     payload: {
    //       selectedTrip,
    //       dayIndex: addEventDayIndex,
    //       placeAt: "end",
    //       event: eventData,
    //     },
    //   });
    // } else {
    //   // Handle FirestoreError
    //   // todo toast error message here
    //   return;
    // }

    setEventComposerShown(false);
    setSessionToken(cuid2.createId());
  }

  return (
    <section
      ref={ref}
      style={{
        left: 172,
        transform: `translate(0,${addEventDayIndex * 132 + 20}px)`,
      }}
      className={`absolute z-20 flex w-60 flex-col justify-end rounded-lg bg-white shadow-borderXl transition-opacity duration-300 ease-kolumb-flow  ${
        isEventComposerShown ? "opacity-100" : "select-none opacity-0"
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
