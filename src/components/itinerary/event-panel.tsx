import { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { useDndData } from "@/components/dnd-itinerary";
import Input from "../ui/input";
import Divider from "../ui/divider";

export default function EventPanel() {
  const {
    dispatchUserTrips,
    selectedTrip,
    activeTrip,
    activeEvent,
    isEventPanelDisplayed,
    setEventPanelDisplay,
    dialogIndexPosition,
  } = useDndData();

  const getImageUrl = (): string => {
    if (!activeEvent?.photo) return "/images/event-placeholder.png";
    if (activeEvent.photo.startsWith("http")) return activeEvent.photo;

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=624&maxheight=320&photo_reference=${activeEvent.photo}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;
  };

  function handleDisplayNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    // activeEvent.display_name = e.target.value;
    // const dayIndex = activeTrip.itinerary?.findIndex((day: Day) => day.date === activeEvent.date);
    // dispatchUserTrips({
    //   type: UT.UPDATE_EVENT_FIELD,
    //   payload: {
    //     selectedTrip: selectedTrip,
    //     dayIndex: dayIndex,
    //     eventIndex: activeEvent.position,
    //     field: "display_name",
    //     value: e.target.value,
    //   },
    // });
  }

  const initialTopPosition = dialogIndexPosition.y * 132 + 20;
  const initialLeftPosition = 148 + dialogIndexPosition.x * 168;

  const topPosition = dialogIndexPosition.y * 132 + 20;
  const leftPosition = 148 + dialogIndexPosition.x * 168;

  return (
    <AnimatePresence>
      {isEventPanelDisplayed && activeEvent && (
        <motion.dialog
          initial={{
            opacity: 0,
            scale: 0.5,
            top: initialTopPosition,
            left: initialLeftPosition,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            top: topPosition,
            left: leftPosition,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
            top: initialTopPosition,
            left: initialLeftPosition,
          }}
          transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1] }}
          className={"absolute z-20 m-0 flex origin-top-left -translate-x-1/2 bg-transparent"}
          autoFocus
          open
        >
          <div className="flex w-80 flex-col overflow-hidden rounded-2xl border-4 border-white bg-white shadow-border3xl">
            <div className="w-80 bg-transparent">
              <Image
                src={getImageUrl()}
                alt="Event Image"
                width={312}
                height={160}
                priority
                className="h-40 object-cover object-center"
              />
            </div>

            <Input
              type="text"
              placeholder="Event Name"
              value={activeEvent?.name}
              onChange={() => {}}
              variant="unstyled"
              className="flex-shrink-0 text-ellipsis p-2 text-lg text-gray-900 placeholder:text-center"
            />

            <div className="p-2 text-sm">datra</div>
            <div className="p-2 text-sm">data</div>
            <div className="p-2 text-sm">darta</div>
            <div className="p-2 text-sm">google actions: refresh, disconnect, delete data</div>
          </div>

          {/* Divides event name input */}
          <Divider className="absolute top-[12.75rem] w-80" />
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
