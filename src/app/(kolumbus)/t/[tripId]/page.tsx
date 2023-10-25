"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Portal = dynamic(() => import("@/components/portal"), { ssr: false });

import useAppdata from "@/context/appdata";

import DndItinerary from "@/components/dnd-itinerary";
import ActionBar from "@/components/itinerary/action-bar";
import { Modal } from "@/components/ui/modal";
import { ItinerarySkeleton } from "@/components/loading/itinerary-skeleton";
import ActionBarSkeleton from "@/components/loading/action-bar-skeleton";

export default function Itinerary({ params: { tripId } }: { params: { tripId: string } }) {
  const { userTrips, selectedTrip, setSelectedTrip, isLoading, isModalShown, modalChildren } = useAppdata();

  // const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedTrip(userTrips.findIndex((trip) => trip.id === tripId));
  }, [setSelectedTrip, userTrips, tripId]);

  return (
    <>
      {/* <div className="px-36 py-36">
        <Popover
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          placement="top-start"
          container={{ selector: "main", margin: [56, 0, 224, 0], padding: [20, 20, 5, 300] }}
          // arrow={{ enabled: true, size: 8 }}
          modifiers={{ offset: 10 }}
        >
          <PopoverTrigger onClick={() => setIsOpen(!isOpen)} className="border p-1 focus:border-kolumblue-200 focus:bg-kolumblue-100">
            open
          </PopoverTrigger>
          <PopoverContent className={{ backdrop: "top-14 ml-56 rounded-tl-lg" }}>
            <div className="bg-white px-4 py-2 shadow-borderXL">
              <button className="border p-1 focus:bg-kolumblue-100">btn</button>
              content
            </div>
          </PopoverContent>
        </Popover>
      </div> */}

      {!isLoading ? <ActionBar activeTrip={userTrips[selectedTrip]} /> : <ActionBarSkeleton />}
      <div className="flex flex-col px-6">{!isLoading ? <DndItinerary userTrips={userTrips} /> : <ItinerarySkeleton />}</div>

      <Portal>
        <Modal showModal={isModalShown} modalChildren={modalChildren} />
      </Portal>
    </>
  );
}
