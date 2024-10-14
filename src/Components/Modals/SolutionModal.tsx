import React, { Fragment, useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { Card } from "../Game/Card";
import { PlayerDataInterface } from "../../Types/store";
import { SolutionModalPropsInterface } from "../../Types/modals";
import { CORRECT_GUESSES } from "../../Utils/globals";

export const SolutionModal: React.FC<SolutionModalPropsInterface> = ({ scores, isOpen, onOpenChange, solution }) => {
  const [_solution, setSolution] = useState<PlayerDataInterface[]>([]);

  useEffect(() => {
    if (solution.length > 0) {
      setSolution(solution);
    }
  }, [solution]);

  return (
    <>
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
              <ModalHeader
                className={`flex flex-col gap-1 text-3xl  ${scores.filter((s: number) => s !== 1).length === CORRECT_GUESSES ? "text-green-600" : "text-red-400"}`}
              >
                {scores.filter((s: number) => s !== 1).length === CORRECT_GUESSES ? "You won!" : "You lost!"}
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col gap-4 mb-4">
                  <h2 className="text-xl font-medium text-center">
                    You got {scores.filter((s: number) => s !== 1).length === CORRECT_GUESSES ? "all" : scores.filter((s: number) => s !== 1).length}{" "}
                    guess{scores.filter((s: number) => s !== 1).length === 1 ? "" : "es"} correct
                  </h2>
                  <h1 className="text-2xl text-center font-semibold text-black">Solution</h1>
                  {_solution.map((player: PlayerDataInterface, index: number) => (
                    <Fragment key={index}>
                      <div className="border-2 border-black bg-gray-700 py-2 px-2 rounded-xl">
                        <Card id={player.PLAYER_ID} name={player.PLAYER_NAME} color="white" ppg={String(player?.PPG)} />
                      </div>
                    </Fragment>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
