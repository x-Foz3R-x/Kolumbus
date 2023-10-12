import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import api from "@/app/_trpc/client";
import { useDndData } from "@/components/dnd-itinerary";

import Input from "../ui/input";
import Divider from "../ui/divider";
import Icon from "../icons";
import { useAnyCloseActions } from "@/hooks/use-accessibility-features";
import { UpdateEvent } from "@/server/routers/event";
import { UT } from "@/types";
import { GetDayIndex } from "@/lib/dnd";

export default function EventPanel() {
  const updateEvent = api.event.update.useMutation();
  const deleteEvent = api.event.delete.useMutation();
  const { dispatchUserTrips, selectedTrip, activeTrip, activeEvent, isEventPanelDisplayed, setEventPanelDisplay, dialogIndexPosition } =
    useDndData();

  const [address, setAddress] = useState(activeEvent?.address ?? "");
  const addressRef = useRef<HTMLTextAreaElement>(null);

  const [note, setNote] = useState(activeEvent?.note ?? "");
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const initialTopPosition = dialogIndexPosition.y * 132 + 20;
  const topPosition = dialogIndexPosition.y * 132 + 20;
  const initialLeftPosition = 148 + dialogIndexPosition.x * 168;
  const leftPosition = 148 + dialogIndexPosition.x * 168;

  const getImageUrl = (): string => {
    if (!activeEvent?.photo) return "/images/event-placeholder.png";
    if (activeEvent.photo.startsWith("http")) return activeEvent.photo;

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=624&maxheight=320&photo_reference=${activeEvent.photo}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;
  };

  const handleUpdate = (data: UpdateEvent) => {
    if (!activeEvent) return;
    const dayIndex = GetDayIndex(activeTrip.itinerary, activeEvent.date);
    dispatchUserTrips({
      type: UT.UPDATE_EVENT,
      payload: { selectedTrip, dayIndex, event: { ...activeEvent, ...data } },
    });

    updateEvent.mutate({
      eventId: activeEvent.id,
      data: data,
    });
  };

  const handleDelete = () => {
    if (!activeEvent) return;

    dispatchUserTrips({
      type: UT.DELETE_EVENT,
      payload: { selectedTrip, dayIndex: GetDayIndex(activeTrip.itinerary, activeEvent?.date), event: activeEvent },
    });

    const events = [...activeTrip.itinerary[GetDayIndex(activeTrip.itinerary, activeEvent.date)].events];
    events.splice(activeEvent.position, 1);
    events.forEach((event, index) => (event.position = index));

    deleteEvent.mutate({ eventId: activeEvent.id, events });
  };

  useEffect(() => {
    setAddress(activeEvent?.address ?? "");
    setNote(activeEvent?.note ?? "");
  }, [activeEvent]);
  useEffect(() => {
    if (addressRef.current) {
      addressRef.current.style.height = "32px";
      addressRef.current.style.height = `${addressRef.current.scrollHeight + 2}px`;
    }
    if (noteRef.current) {
      noteRef.current.style.height = "52px";
      noteRef.current.style.height = `${noteRef.current.scrollHeight + 2}px`;
    }
  }, [address, note, isEventPanelDisplayed]);

  const ref = useRef<HTMLDialogElement>(null);
  useAnyCloseActions(ref, () => setEventPanelDisplay(false));

  return (
    <AnimatePresence>
      {isEventPanelDisplayed && activeEvent && (
        <motion.dialog
          ref={ref}
          initial={{
            scale: 0.5,
            top: initialTopPosition,
            left: initialLeftPosition,
          }}
          animate={{
            scale: 1,
            top: topPosition,
            left: leftPosition,
          }}
          exit={{
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
              <Image src={getImageUrl()} alt="Event Image" width={312} height={160} priority className="h-40 object-cover object-center" />
            </div>

            <Input
              type="text"
              placeholder="Event Name"
              value={activeEvent?.name ?? ""}
              onChange={(e) => handleUpdate({ name: e.target.value })}
              variant="unstyled"
              className="flex-shrink-0 text-ellipsis bg-transparent p-2 text-lg text-gray-900 placeholder:text-center"
            />

            <div className="flex flex-col gap-4 px-1 py-2 text-sm font-medium delay-150">
              <div className="relative flex w-full items-center">
                <Icon.pin className="absolute left-4 h-4" />
                <textarea
                  ref={addressRef}
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={(e) => handleUpdate({ address: e.target.value })}
                  className="w-full resize-none rounded-lg border p-1.5 pl-10"
                />
              </div>

              <div className="flex w-full gap-3">
                <div className="relative flex items-center">
                  <Icon.x className="absolute left-4 h-3" />
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={activeEvent?.phoneNumber ?? ""}
                    onChange={(e) => handleUpdate({ phoneNumber: e.target.value })}
                    className="w-full rounded-lg bg-transparent p-1.5 pl-10"
                  />
                </div>

                <div className="relative flex w-2/5 items-center">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={activeEvent?.cost ?? ""}
                    onChange={(e) => handleUpdate({ cost: Number(e.target.value) })}
                    className="w-full rounded-lg bg-transparent p-1.5"
                  />
                </div>
              </div>

              <div className="relative flex w-full items-center">
                <Icon.x className="absolute left-4 h-3" />
                <Input
                  type="text"
                  placeholder="www.example.com"
                  value={activeEvent?.website ?? ""}
                  onChange={(e) => handleUpdate({ website: e.target.value })}
                  fullWidth
                  className="w-full rounded-lg bg-transparent p-1.5 pl-10"
                />
              </div>

              <div className="relative flex w-full items-center">
                <Icon.x className="absolute left-4 h-3" />
                <textarea
                  ref={noteRef}
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={(e) => handleUpdate({ note: e.target.value })}
                  className="w-full resize-none rounded-lg border p-1.5 pl-10"
                />
              </div>

              {typeof activeEvent?.openingHours?.open_now === "boolean" && (
                <div className="relative flex w-full items-center">
                  <Icon.x className="absolute left-4 h-3" />
                  <div className="w-full rounded-lg bg-transparent p-1.5 pl-10">
                    {activeEvent?.openingHours?.open_now === true ? "Open Now" : "Closed"}
                  </div>
                </div>
              )}

              {activeEvent?.placeId && (
                <div className="relative flex w-full items-center gap-3 rounded-lg text-sm shadow-border">
                  <Icon.google className="absolute left-4 h-3" />
                  <div className="flex w-full justify-evenly pl-10 pr-2">
                    <button className="p-2 hover:bg-gray-200">refresh</button>
                    <button onClick={() => handleUpdate({ placeId: null, url: null })} className="p-2 hover:bg-gray-200">
                      disconnect
                    </button>
                  </div>
                </div>
              )}

              <div className="flex w-full justify-end gap-3 px-2">
                <button className="rounded-lg px-4 py-2 shadow-border hover:bg-gray-200">cancel</button>
                <button onClick={handleDelete} className="rounded-lg px-4 py-2 shadow-border hover:bg-gray-200">
                  delete
                </button>
              </div>
            </div>
          </div>

          {/* Divides event name input */}
          <Divider className="absolute top-[207px] w-80" />
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
