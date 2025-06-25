import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { GenericModalsPropsInterface } from "./Types";

export const GuideModal: React.FC<GenericModalsPropsInterface> = ({ isOpen, onOpenChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="3xl"
      classNames={{
        base: "p-2 border-4 border-gray-800",
        closeButton: "p-2 text-3xl font-extrabold text-black hover:text-gray-200 hover:bg-red-400 mt-2 mr-2",
        header: "text-center text-2xl font-bold",
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1 underline italic">How to play</ModalHeader>
            <ModalBody className="text-lg">
              <ul className="list-disc list-outside pl-6 space-y-4">
                <li>
                  Rank <span className="font-bold">5</span> random NBA players by the randomly generated stat category: 
                  <span className="font-bold"> Points Per Game</span>, 
                  <span className="font-bold"> Assists Per Game</span>, 
                  <span className="font-bold"> Rebounds Per Game</span>, or 
                  <span className="font-bold"> Games Played</span>.
                </li>
                <li>
                  Arrange them from 
                  <span className="font-bold"> highest to lowest</span> based on the category.
                </li>
                <li>
                  You get <span className="font-bold">3</span> total attempts to get it right.
                </li>
                <li>
                  After each attempt, you'll be told <span className="font-bold">how many</span> players were correctly placed, 
                  but <span className="font-bold">not which ones</span>.
                </li>
                <li>
                  Good luck, and have fun!
                </li>
              </ul>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
