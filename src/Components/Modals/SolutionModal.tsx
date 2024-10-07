import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { Card } from "../Game/Card";
import { PlayerDataInterface } from "../../Types/store";

interface SolutionModalProps {
  correctGuesses: number;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  correctGuesses,
  isOpen,
  onOpenChange,
}) => {
  const solution = structuredClone(
    useSelector((state: RootState) => state.snapshot.players),
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        size="3xl"
      >
        <ModalContent>
          <>
            <ModalHeader
              className={`${correctGuesses === 5 ? "text-green-600" : "text-red-400"} text-center text-2xl font-bold flex flex-1 flex-col`}
            >
              {correctGuesses === 5 ? "You won!" : "You lost!"}
            </ModalHeader>
            <ModalBody>
              {correctGuesses === 5 ? (
                ""
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {solution.map(
                    (player: PlayerDataInterface, index: number) => (
                      <>
                        <Card
                          id={player.PLAYER_ID}
                          name={player.PLAYER_NAME}
                          ppg={String(player.PPG)}
                        />
                      </>
                    ),
                  )}
                </div>
              )}
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};
