import { memo, useRef } from "react";

import { Day } from "@/types";

import Icon from "../icons";
import { Button, ScrollIndicator } from "../ui";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "../ui/modal";
import { ActivityOverlay } from "../dnd-itinerary/events";

// todo - limit the number of days and events in days to be displayed in the list (e.g. 5 days and 5 events) and add text like "and 3 more" to indicate that there are more days and events that have'nt been displayed in the list to avoid cluttering the UI
// todo - show selected dates to help user understand what dates are being deleted
// todo - show day number next to day date in the list

type ExcludedDaysModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  daysToDelete: Day[];
  onDeleteEvents: () => void;
};
export function ExcludedDaysModal({ open, setOpen, daysToDelete, onDeleteEvents }: ExcludedDaysModalProps) {
  const listScrollRef = useRef<HTMLUListElement>(null);

  return (
    <Modal open={open} setOpen={setOpen} size="xl">
      <ModalBody.iconDesign variant="danger" icon={<Icon.triangleExclamation />}>
        <ModalHeader>Events Scheduled on Excluded Days</ModalHeader>

        <ModalText>The following events are scheduled on the day(s) you are about to remove:</ModalText>

        {/* List of events to be deleted */}
        <div className="relative">
          <ul ref={listScrollRef} className="flex w-[470px] gap-2 overflow-x-auto rounded-xl border-[6px] border-gray-100 bg-gray-100">
            {daysToDelete.map((day, index) => (
              <DayToDelete key={`DTD-${index}`} day={day} />
            ))}
            <ScrollIndicator
              scrollRef={listScrollRef}
              size={30}
              zIndex={50}
              className={{ both: "from-gray-100", start: "rounded-l-xl", end: "rounded-r-xl" }}
              animate
            />
          </ul>
        </div>

        <ModalText>Are you sure you want to proceed and permanently delete the mentioned events?</ModalText>
      </ModalBody.iconDesign>

      <ModalControls>
        <Button onClick={() => setOpen(false)} whileHover={{ scale: 1.05 }} animatePress>
          Cancel
        </Button>
        <Button onClick={onDeleteEvents} whileHover={{ scale: 1.05 }} animatePress className="bg-red-500 text-white">
          Delete Events
        </Button>
      </ModalControls>
    </Modal>
  );
}

const DayToDelete = memo(function DaysToDelete({ day }: { day: Day }) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const date = new Date(day.date);

  if (day.events.length === 0) return null;

  return (
    <li className="relative">
      <h3 className="mb-0.5 rounded-b rounded-t-lg border-b border-gray-200 bg-white py-1 text-center text-sm font-medium text-gray-600">
        {`${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`}
      </h3>

      <ul ref={scrollRef} className="max-h-28 overflow-y-auto rounded-b-lg rounded-t bg-white px-2 py-2">
        {day.events.map((event, index) => (
          <Button
            key={`listItem${index}`}
            variant="unset"
            size="unset"
            className="w-40 cursor-default overflow-hidden text-ellipsis whitespace-nowrap rounded px-2 py-1 text-sm text-gray-500 [&:nth-child(odd)]:bg-gray-50"
            tooltip={{
              placement: "bottom-start",
              offset: 24,
              zIndex: 1000,
              className: "p-0 rounded-lg bg-transparent shadow-floatingHover",
              followCursor: true,
              children: <ActivityOverlay event={event} selectCount={0} />,
            }}
          >
            {event.name}
          </Button>
        ))}

        <ScrollIndicator scrollRef={scrollRef} top={31} insetX={8} size={20} zIndex={50} vertical animate />
      </ul>
    </li>
  );
});
