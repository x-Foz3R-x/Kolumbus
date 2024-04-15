import { memo } from "react";

import Icon from "./icons";
import { Button } from "./ui";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "./ui/modal";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onLeave: () => void;
};
export const ConfirmTripLeave = memo(function DeleteTripModal({ isOpen, setOpen, onLeave: handleLeave }: Props) {
  return (
    <Modal open={isOpen} setOpen={setOpen}>
      <ModalBody.iconDesign variant="danger" icon={<Icon.triangleExclamation />}>
        <ModalHeader>Planning to Leave this Trip?</ModalHeader>
        <ModalText>Are you sure you want to leave this trip? There’s no turning back.</ModalText>
      </ModalBody.iconDesign>

      <ModalControls>
        <Button onClick={() => setOpen(false)} whileHover={{ scale: 1.05 }} animatePress>
          I’m Staying
        </Button>
        <Button
          onClick={() => {
            handleLeave();
            setOpen(false);
          }}
          whileHover={{ scale: 1.05 }}
          animatePress
          className="whitespace-nowrap bg-red-500 text-white"
        >
          I’m Leaving
        </Button>
      </ModalControls>
    </Modal>
  );
});
