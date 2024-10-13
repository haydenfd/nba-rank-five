import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { GenericModalsPropsInterface } from "../../Types/modals";

export const GuideModal: React.FC<GenericModalsPropsInterface> = ({ isOpen, onOpenChange }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top" size="3xl">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">This be the guide modal</ModalHeader>
            <ModalBody>
              <p>Poop</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
