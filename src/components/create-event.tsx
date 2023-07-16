"use client";

import { useState } from "react";
import GoogleMapsSearch from "./google-maps-search";
import Icon from "./icons";
import { RadioIconsInline } from "./ui/radio";

export default function CreateEvent() {
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Find interesting places"
  );

  return (
    <div className="absolute left-[9.25rem] z-50 mt-5 flex h-[6.75rem] w-60 flex-col rounded-[0.625rem] bg-white shadow-container duration-700 ease-kolumb-flow">
      <h1 className="w-full cursor-default rounded-t-[0.625rem] pt-1 text-center text-sm font-medium capitalize text-kolumbGray-500">
        create event
      </h1>

      <section className="flex h-6 flex-1 items-start justify-between gap-2 px-2 pb-1 text-center text-sm">
        <RadioIconsInline
          title="type"
          setValue={setSearchPlaceholder}
          name="event_type"
          options={[
            {
              name: "explore",
              value: "Find interesting places",
              element: <Icon.explore className="h-4 w-4" />,
            },
            {
              name: "food",
              value: "Find a place to eat",
              element: <Icon.forkKnife className="h-4 w-4 p-[1px]" />,
            },
            {
              name: "accommodation",
              value: "Find a place to stay",
              element: <Icon.bed className="h-4 w-4 p-[1px]" />,
            },
            {
              name: "transportation",
              value: "Find destination point",
              element: <Icon.carPlane className="h-4 w-4" />,
            },
          ]}
        />

        <RadioIconsInline
          title="place at"
          setValue={() => {}}
          name="event_placement"
          options={[
            {
              name: "start",
              element: <Icon.x className="w-4 p-[2px]" />,
            },
            {
              name: "end",
              element: <Icon.x className="w-4 p-[2px]" />,
            },
          ]}
        />
      </section>

      <GoogleMapsSearch placeholder={searchPlaceholder} />
    </div>
  );
}
