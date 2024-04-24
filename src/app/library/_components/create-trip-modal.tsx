"use client";

import { memo, useRef, useState } from "react";

import { Button, type ButtonProps, Icons, Input } from "~/components/ui";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "~/components/ui/modal";

// todo: add date/days picker

type Props = {
  onCreate: (name: string) => void;
  buttonProps: ButtonProps;
};
export const CreateTripModal = memo(function CreateTripModal({
  onCreate: handleCreate,
  buttonProps,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const nameRef = useRef("");

  const createNewTrip = () => {
    handleCreate(nameRef.current);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} {...buttonProps} />

      <Modal open={isOpen} setOpen={setOpen} dismissible>
        <ModalBody.iconDesign icon={<Icons.defaultTrip />}>
          <ModalHeader>Create Trip</ModalHeader>

          <ModalText>
            Enter details below to create a new trip and start planning your itinerary.
          </ModalText>

          <Input insetLabel="Trip Name" onUpdate={(e) => (nameRef.current = e.target.value)} />
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
