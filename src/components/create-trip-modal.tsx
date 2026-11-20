"use client";

import { memo, useState } from "react";
import { add } from "date-fns";
import { formatDate } from "~/lib/utils";

import Calendar from "./calendar";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "~/components/ui/modal";
import { Button, Icons, Input } from "~/components/ui";

// TODO: add trip preview like in trello create board modal

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  maxDays: number;
  returnFocus?: boolean;
  onCreate: (name: string, startDate: string, endDate: string) => void;
};
export const CreateTripModal = memo(function CreateTripModal({
  isOpen,
  setOpen,
  maxDays,
  returnFocus,
  onCreate: handleCreate,
}: Props) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(add(new Date(), { days: 5 }));

  const cancel = () => {
    setOpen(false);
    setName("");
    setStartDate(new Date());
    setEndDate(add(new Date(), { days: 5 }));
  };

  const createNewTrip = () => {
    handleCreate(name, formatDate(startDate), formatDate(endDate));
    setOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setOpen={setOpen} dismissible returnFocus={returnFocus}>
      <ModalBody.iconDesign icon={<Icons.defaultTrip />}>
        <ModalHeader>Create Trip</ModalHeader>

        <ModalText>
          Enter details below to create a new trip and start planning your itinerary.
        </ModalText>

        <div className="flex flex-wrap gap-3">
          <Input
            value={name}
            label="Trip Name"
            maxLength={100}
            className={{ container: "min-w-0 basis-full sm:flex-1 sm:basis-40" }}
            onChange={(e) => setName(e.target.value)}
          />

          <Calendar
            startDate={formatDate(startDate)}
            endDate={formatDate(endDate)}
            maxDays={maxDays}
            onApply={(startDate, endDate) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            placement="bottom-end"
          />
        </div>
      </ModalBody.iconDesign>

      <ModalControls>
        <Button onClick={cancel} whileHover={{ scale: 1.05 }} animatePress className="px-5">
          Cancel
        </Button>
        <Button
          onClick={createNewTrip}
          disabled={!name.trim()}
          whileHover={{ scale: 1.05 }}
          animatePress
          className="whitespace-nowrap bg-kolumblue-500 text-gray-100"
        >
          Create trip
        </Button>
      </ModalControls>
    </Modal>
  );
});
