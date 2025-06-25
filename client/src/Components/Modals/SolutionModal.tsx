import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { SolutionModalPropsInterface } from "./Types";
import { useGameContext } from "../../Context/GameContext";
import { SolutionCard } from "../PlayerCard/SolutionCard";

export const SolutionModal: React.FC<SolutionModalPropsInterface> = ({ result, isOpen, onOpenChange }) => {
  const { players, solution } = useGameContext();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="2xl"
      classNames={{
        base: "p-2 border-4 border-gray-800",
        closeButton: "p-2 text-3xl font-extrabold text-black hover:text-gray-200 hover:bg-red-400 mt-2 mr-2",
        header: "text-center text-2xl font-bold",
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-3xl">You {result}</ModalHeader>
            <ModalBody>
              <div className="flex flex-wrap justify-around gap-4">
                {solution &&
                  solution.map((solutionId, idx) => {
                    const solutionPlayer = players.find(p => p.PLAYER_ID === solutionId);
                    const guessedPlayer = players[idx];

                    if (!solutionPlayer) return null;

                    const isCorrect = guessedPlayer?.PLAYER_ID === solutionPlayer.PLAYER_ID;
                    const bgColor = isCorrect ? "bg-green-600" : "bg-red-600";

                    return (
                      <SolutionCard
                        key={solutionPlayer.PLAYER_ID.toString()}
                        id={solutionPlayer.PLAYER_ID.toString()}
                        name={solutionPlayer.PLAYER_NAME}
                        ppg={
                          solutionPlayer.APG?.toString() ||
                          solutionPlayer.PPG?.toString() ||
                          solutionPlayer.GP?.toString() ||
                          solutionPlayer.RPG?.toString() ||
                          ""
                        }
                        code={solutionPlayer.CODE}
                        color="white"
                        classNames={`border-2 border-slate-800 p-2 rounded-xl ${bgColor}`}
                      />
                    );
                  })}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
