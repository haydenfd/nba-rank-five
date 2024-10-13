import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { Card } from "../Game/Card";
import { PlayerDataInterface } from "../../Types/store";

interface SolutionModalProps {
  scores: number[];
  isOpen: boolean;
  onOpenChange: () => void;
  attempts?: number;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  scores,
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
        classNames={{
          base: "p-2",
          closeButton: "p-2 text-3xl font-extrabold text-black hover:text-gray-200 hover:bg-red-400 mt-2 mr-2", // Customize close button here
          header: "text-center text-2xl font-bold", // Center and enlarge the title
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className={`flex flex-col gap-1 text-3xl  ${scores.filter((s:number) => s !== 1).length === 5 ? "text-green-600" : "text-red-400"}`}>
              {scores.filter((s:number) => s !== 1).length === 5 ? "You won!" : "You lost!"}
              </ModalHeader>
              <ModalBody>
              <div className="w-full flex flex-col gap-4 mb-4">
                  <h1 className="text-2xl text-center font-semibold text-black">Solution</h1>
                  {solution.map(
                    (player: PlayerDataInterface, index: number) => (
                      <>
                        <div className="border-2 border-black bg-gray-700 py-2 px-2 rounded-xl">
                          <Card
                            id={player.PLAYER_ID}
                            name={player.PLAYER_NAME}
                            ppg=""
                            color="white"
                            // ppg={String(player.PPG)}
                            />
                        </div>
                      </>
                    ),
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
