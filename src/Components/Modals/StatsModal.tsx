import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { BarChartIcon } from "@radix-ui/react-icons";

export function StatsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="default"
        className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent hover:border-white transition ease-in-out delay-150"
        startContent={
          <BarChartIcon className="scale-[150%] text-white md:mr-2" />
        }
        onClick={onOpen}
      >
        <span className="hidden md:inline text-xl text-white">Statistics</span>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Here are your stats!
              </ModalHeader>
              <ModalBody>
                <p>One Hundo p yo</p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
