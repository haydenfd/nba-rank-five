import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure} from "@nextui-org/react";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export function GuideModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
        <Button
          color="default"
          className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent hover:border-white transition ease-in-out delay-150"
          startContent={
            <QuestionMarkCircledIcon className="scale-[150%] text-white md:mr-2" />
          }
          onClick={onOpen}
        >
          <span className="hidden md:inline text-xl text-white">Guide</span>
        </Button>      
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top" size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">This be the guide modal</ModalHeader>
              <ModalBody>
                <p> 
                  Poop
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
