"use client";

import { memo, useState } from "react";

import { Button, type ButtonProps, Icons, Input } from "~/components/ui";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "~/components/ui/modal";
import { DatePicker } from "./date-picker";
import { formatDate } from "~/lib/utils";
import { add } from "date-fns";

type Props = {
  maxDays: number;
  onCreate: (name: string, startDate: string, endDate: string) => void;
  buttonProps: ButtonProps;
};
export const CreateTripModal = memo(function CreateTripModal({
  maxDays,
  onCreate: handleCreate,
  buttonProps,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(add(new Date(), { days: 5 }));

  const createNewTrip = () => {
    handleCreate(name, formatDate(startDate), formatDate(endDate));
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} {...buttonProps} />

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
          <Button
            onClick={() => setOpen(false)}
            whileHover={{ scale: 1.05 }}
            animatePress
            className="px-5"
          >
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
    </>
  );
});
