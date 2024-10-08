import React, { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { Card } from "../Game/Card";
import { PlayerDataInterface } from "../../Types/store";
import { apiClient } from "../../Api/axiosClient";

interface SolutionModalProps {
  correctGuesses?: number;
  isOpen: boolean;
  onOpenChange: () => void;
  attempts?: number;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  correctGuesses,
  isOpen,
  onOpenChange,
  attempts,
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
                <div>
                  <h1>You took {attempts} tries!</h1>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  <h1>You took {attempts} tries!</h1>
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
