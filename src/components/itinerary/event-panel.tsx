import Dialog from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDndData } from "@/components/dnd-itinerary";
import { currencyList } from "@/data/currency";
import { DropdownSelect } from "@/components/ui/dropdown";
import Icon from "@/components/icons";
import { RadioIconsInline } from "@/components/ui/radio";
import { useAnyCloseActions } from "@/hooks/use-accessibility-features";
import { Day, UT } from "@/types";

export default function EventEditableDetails() {
  const { dispatchUserTrips, selectedTrip, activeTrip, activeEvent } = useDndData();

  const [eventEditableDetailsState, setEventEditableDetailsState] = useState<
    "hidden" | "hiding" | "shown" | "showing"
  >("hidden");
  const [currencySelectedIndex, setCurrencySelectedIndex] = useState(0);
  // console.log(activeEvent);

  useEffect(() => {
    if (activeEvent && eventEditableDetailsState === "hidden") {
      setEventEditableDetailsState("showing");
    }
  }, [activeEvent]);

  const ref = useRef<HTMLDivElement>(null);
  useAnyCloseActions(ref, () => setEventEditableDetailsState("hidden"));

  function handleDisplayNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    activeEvent.display_name = e.target.value;
    const dayIndex = activeTrip.itinerary?.findIndex((day: Day) => day.date === activeEvent.date);
    dispatchUserTrips({
      type: UT.UPDATE_EVENT_FIELD,
      payload: {
        selectedTrip: selectedTrip,
        dayIndex: dayIndex,
        eventIndex: activeEvent.position,
        field: "display_name",
        value: e.target.value,
      },
    });
  }
  // console.log(activeTrip);
  // console.log(activeEvent);

  return eventEditableDetailsState !== "hidden" ? (
    <Dialog.Root
      ref={ref}
      style={{
        top: 108 + 110,
        left: 140 + activeEvent?.position * 80,
      }}
    >
      <div className="relative flex-1 border-b border-gray-200 p-1">
        <span className="absolute left-2 top-[5.25rem] z-10 ">
          <div className="relative flex flex-col">
            <input
              type="number"
              value={activeEvent?.cost ?? 0}
              max={100000}
              onChange={() => {}}
              className={`peer w-28 appearance-none rounded-md bg-white/60 px-3 py-1 pl-2 text-sm shadow-border outline-0 backdrop-blur-[4px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-flow placeholder:text-gray-400 focus:z-10 focus:shadow-focus focus:outline-0`}
              // onChange={onChange}
            />

            {/* <label className="pointer-events-none absolute inset-0 left-2 flex items-center overflow-hidden text-sm text-gray-600">
              Cost
            </label> */}

            <DropdownSelect
              optionHeight={28}
              maxVisibleOptionsLength={6}
              selectList={currencyList}
              selectedIndex={currencySelectedIndex}
              setSelectedIndex={setCurrencySelectedIndex}
              className="inset-y-0 right-0 w-14 rounded peer-focus:z-10"
            />
          </div>
        </span>

        <Image
          src={"/images/Untitled.png"}
          alt="Event Image"
          width={218}
          height={112}
          priority
          className="h-28 rounded-t-lg object-cover object-center shadow-border"
        />

        {/* <Input2.Unstyled
          type="text"
          value={activeEvent?.display_name}
          placeholder="Name your event"
          width={218}
          onValueChange={handleDisplayNameChange}
          className="mt-1 p-1 text-sm focus:border-kolumblue-500"
        /> */}
      </div>

      <div className="p-2">
        <RadioIconsInline
          name="event_type"
          options={[
            {
              display_name: "explore",
              value: "Find interesting places",
              element: <Icon.explore className="h-5 w-10 p-px" />,
            },
            {
              display_name: "food",
              value: "Find a place to eat",
              element: <Icon.forkKnife className="h-5 w-10 py-px" />,
            },
            {
              display_name: "accommodation",
              value: "Find a place to stay",
              element: <Icon.bed className="h-5 w-10 py-0.5" />,
            },
            {
              display_name: "transportation",
              value: "Find destination point",
              element: <Icon.carPlane className="h-5 w-10 py-px" />,
            },
          ]}
        />

        <div className="mb-3"></div>

        {/* <Input2.WithInsetLabel
          type="text"
          value=""
          label="Address"
          width={210}
          onChange={() => {}}
          className="mb-px rounded-t-md"
        /> */}
        {/* <Input2.WithInsetLabel
          type="text"
          value=""
          label="Website"
          width={210}
          onChange={() => {}}
          className="rounded-b-md"
        /> */}
        {/* <br />
        <div>start/end time: | </div>
        <div>duration (in hrs):</div> */}
      </div>
    </Dialog.Root>
  ) : (
    <></>
  );
}
