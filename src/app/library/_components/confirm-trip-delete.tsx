"use client";

import { memo } from "react";

import { Button, Icons } from "~/components/ui";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "~/components/ui/modal";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
};
export const ConfirmTripDelete = memo(function DeleteTripModal({
  isOpen,
  setOpen,
  onDelete: handleDelete,
}: Props) {
  return (
    <Modal open={isOpen} setOpen={setOpen}>
      <ModalBody.iconDesign variant="danger" icon={<Icons.triangleExclamation />}>
        <ModalHeader>Trip Deletion</ModalHeader>
        <ModalText>Are you sure you want to delete this trip? There’s no turning back.</ModalText>
      </ModalBody.iconDesign>

      <ModalControls>
        <Button onClick={() => setOpen(false)} whileHover={{ scale: 1.05 }} animatePress>
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleDelete();
            setOpen(false);
          }}
          whileHover={{ scale: 1.05 }}
          animatePress
          className="whitespace-nowrap bg-red-500 text-white"
        >
          Delete Trip
        </Button>
      </ModalControls>
    </Modal>
  );
});
