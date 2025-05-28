import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { StatsBox } from "./StatsBox";
import { GenericModalsPropsInterface } from "../../Types/modals";
import { computeWeightedAvg, computeWinPercentage } from "../../Utils/StatComputations";
import { useStatsContext } from "../../Context/StatsContext";

export const StatsModal: React.FC<GenericModalsPropsInterface> = ({ isOpen, onOpenChange }) => {
  const { stats } = useStatsContext();
  const avgAttempts = computeWeightedAvg(
    stats.attempts_per_win_distro.slice(0, 3) as [number, number, number],
    stats.games_won
  );

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
            <ModalHeader className="flex flex-col gap-1 text-3xl">Your Stats</ModalHeader>
            <ModalBody>
              <div className="flex flex-wrap justify-around gap-8 my-4">
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={String(stats.games_played)} ctx="Games Played" />
                </div>
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${computeWinPercentage(stats.games_won, stats.games_played)}%`} ctx="Win Percentage" />
                </div>
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${stats.curr_streak}`} ctx="Current Streak" />
                </div>
                <div className="h-28 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${stats.longest_streak}`} ctx="Longest Streak" />
                </div>
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${avgAttempts.toFixed(2)}`} ctx="Avg. Attempts Per Win" />
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
