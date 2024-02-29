import { memo } from "react";

import Icon from "./icons";
import { Button } from "./ui";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "./ui/modal";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
};
export const ConfirmTripDelete = memo(function DeleteTripModal({ isOpen, setOpen, onDelete: handleDelete }: Props) {
  const deleteTrip = () => {
    handleDelete();
    setOpen(false);
  };

  return (
    <Modal open={isOpen} setOpen={setOpen}>
      <ModalBody.iconDesign variant="danger" icon={<Icon.triangleExclamation />}>
        <ModalHeader>Delete Trip</ModalHeader>

        <ModalText>Are you sure you want to delete this trip?</ModalText>
      </ModalBody.iconDesign>

      <ModalControls>
        <Button onClick={() => setOpen(false)} whileHover={{ scale: 1.05 }} animatePress>
          Cancel
        </Button>

        <Button onClick={deleteTrip} whileHover={{ scale: 1.05 }} animatePress className="whitespace-nowrap bg-red-500 text-white">
          Delete trip
        </Button>
      </ModalControls>
    </Modal>
  );
});
