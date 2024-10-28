import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { GenericModalsPropsInterface } from "../../Types/modals";

export const GuideModal: React.FC<GenericModalsPropsInterface> = ({ isOpen, onOpenChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top"
      size="3xl"
      classNames={{
        base: "p-2",
        closeButton: "p-2 text-3xl font-extrabold text-black hover:text-gray-200 hover:bg-red-400 mt-2 mr-2",
        header: "text-center text-2xl font-bold",
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">How to play</ModalHeader>
            <ModalBody>
              <h3>This is how to play. You get three attempts etc etc</h3>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
