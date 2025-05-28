import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { GenericModalsPropsInterface } from "../../Types/modals";

export const GuideModal: React.FC<GenericModalsPropsInterface> = ({ isOpen, onOpenChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
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
            <ModalHeader className="flex flex-col gap-1 underline italic">How to play</ModalHeader>
            <ModalBody className="text-lg">
              <ul>
                <li>
                <span className="block">You have to rank <span className="font-bold">6</span> random NBA players by <span className="font-bold">Points Per Game</span>.</span>
                </li>
                <li>
                <span className="block"> You must rank the players in descending order, from <span className="font-bold">Highest to Lowest</span>.</span>
                </li>
                <li>
                <span className="block">You get <span className="font-bold">3</span> attempts.</span>

                </li>
                <li>
              <span className="block">After each attempt, you get feedback on correct and incorrect guesses.</span>

                </li>
                <li>
              <span className="block">Thanks for playing. Have fun!</span>

                </li>
              </ul>
              
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
