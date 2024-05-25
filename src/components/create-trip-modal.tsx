"use client";

import { memo, useState } from "react";
import { add } from "date-fns";
import { formatDate } from "~/lib/utils";

import { DatePicker } from "./date-picker";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "~/components/ui/modal";
import { Button, Icons, Input } from "~/components/ui";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  maxDays: number;
  onCreate: (name: string, startDate: string, endDate: string) => void;
};
export const CreateTripModal = memo(function CreateTripModal({
  isOpen,
  setOpen,
  maxDays,
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
    <Modal isOpen={isOpen} setOpen={setOpen} dismissible>
      <ModalBody.iconDesign icon={<Icons.defaultTrip />}>
        <ModalHeader>Create Trip</ModalHeader>

        <ModalText>
          Enter details below to create a new trip and start planning your itinerary.
        </ModalText>

        <div className="flex gap-3">
          <Input value={name} insetLabel="Trip Name" onChange={(e) => setName(e.target.value)} />

          <DatePicker
            startDate={formatDate(startDate)}
            endDate={formatDate(endDate)}
            maxDays={maxDays}
            onApply={(startDate, endDate) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            placement="right"
            className="scale-110"
          />
        </div>
      </ModalBody.iconDesign>

      <ModalControls>
        <Button onClick={cancel} whileHover={{ scale: 1.05 }} animatePress className="px-5">
          Cancel
        </Button>
        <Button
          onClick={createNewTrip}
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
