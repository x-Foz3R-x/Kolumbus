import { memo, useRef } from "react";
import { format } from "date-fns";

import type { DaySchema } from "~/lib/validations/trip";
import type { ActivityEventSchema } from "~/lib/validations/place";

import { ActivityOverlay } from "~/components/dnd-itinerary/events";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "~/components/ui/modal";
import { Button, Icons, ScrollIndicator } from "~/components/ui";

// todo - limit the number of days and events in days to be displayed in the list (e.g. 5 days and 5 events) and add text like "and 3 more" to indicate that there are more days and events that have'nt been displayed in the list to avoid cluttering the UI
// todo - show selected dates to help user understand what dates are being deleted

type ExcludedDaysModalProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
  daysToDelete: DaySchema[];
  onDeleteEvents: (startDate: Date, endDate: Date) => void;
};
export function ExcludedDaysModal({
  isOpen,
  setOpen,
  startDate,
  endDate,
  daysToDelete,
  onDeleteEvents,
}: ExcludedDaysModalProps) {
  const listScrollRef = useRef<HTMLUListElement>(null);

  const filteredDaysToDelete = daysToDelete.filter((day) => day.events.length > 0).slice(0, 5);

  return (
    <Modal isOpen={isOpen} setOpen={setOpen} size="xl">
      <ModalBody.iconDesign variant="danger" icon={<Icons.triangleExclamation />}>
        <ModalHeader>Events Scheduled on Excluded Days</ModalHeader>

        <ModalText>
          The following events are scheduled on the day(s) you are about to remove:
        </ModalText>

        {/* List of events to be deleted */}
        <div className="relative">
          <ul
            ref={listScrollRef}
            className="flex w-[470px] gap-2 overflow-x-auto rounded-xl border-[6px] border-gray-100 bg-gray-100"
          >
            {filteredDaysToDelete.slice(0, 5).map((day, index) => (
              <DayToDelete key={`DTD-${index}`} day={day} />
            ))}

            {filteredDaysToDelete.slice(5).flatMap((day) => day.events).length > 0 && (
              <div className="flex flex-col items-center justify-center rounded-md border-b bg-white px-4 py-2 text-xs font-medium text-gray-500">
                <span>And</span>
                <span className="text-sm font-semibold">
                  {filteredDaysToDelete.slice(5).flatMap((day) => day.events).length}
                </span>
                <span>Events</span>
                <span>More</span>
              </div>
            )}

            <ScrollIndicator
              scrollRef={listScrollRef}
              size={30}
              zIndex={50}
              className={{ both: "from-gray-100", start: "rounded-l-xl", end: "rounded-r-xl" }}
            />
          </ul>
        </div>

        <ModalText>
          Are you sure you want to proceed and permanently delete the mentioned events?
        </ModalText>
      </ModalBody.iconDesign>

      <ModalControls>
        <Button onClick={() => setOpen(false)} whileHover={{ scale: 1.05 }} animatePress>
          Cancel
        </Button>
        <Button
          onClick={() => onDeleteEvents(startDate, endDate)}
          whileHover={{ scale: 1.05 }}
          animatePress
          className="bg-red-500 text-white"
        >
          Delete Events
        </Button>
      </ModalControls>
    </Modal>
  );
}

const DayToDelete = memo(function DaysToDelete(props: { day: DaySchema }) {
  const scrollRef = useRef<HTMLUListElement>(null);

  const date = new Date(props.day.date);
  const dayNumber = Number(props.day.id.split("d")[1]) + 1;

  return (
    <li className="relative">
      <h3 className="mb-0.5 flex items-center justify-between rounded-b rounded-t-lg border-b bg-white px-2 py-1 text-xs font-medium text-gray-500">
        <span>{format(date, "d MMMM")}</span>
        <span>Day {dayNumber}</span>
      </h3>

      <ul
        ref={scrollRef}
        className="max-h-28 overflow-y-auto rounded-b-lg rounded-t border-b bg-white p-2"
      >
        {props.day.events.map((event, index) => (
          <Button
            key={`listItem${index}`}
            variant="unset"
            size="unset"
            className="w-40 cursor-default overflow-hidden text-ellipsis whitespace-nowrap rounded px-2 py-1 text-left text-sm [&:nth-child(odd)]:bg-gray-50"
            tooltip={{
              placement: "bottom-start",
              offset: 24,
              zIndex: 1000,
              className: "p-0 rounded-lg bg-transparent shadow-floatingHover",
              followCursor: true,
              children: <ActivityOverlay event={event as ActivityEventSchema} selectCount={0} />,
            }}
          >
            {event.activity?.name}
          </Button>
        ))}

        <ScrollIndicator scrollRef={scrollRef} top={31} insetX={8} size={20} zIndex={50} vertical />
      </ul>
    </li>
  );
});
