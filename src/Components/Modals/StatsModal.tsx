import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { apiClient } from "../../Api/axiosClient";
import { StatsBox } from "../Game/StatsBox";
import { GenericModalsPropsInterface } from "../../Types/modals";

interface StatsModalState {
  games_played: number;
  wins: number;
  longest_streak: number;
  current_streak: number;
  attempts_distribution: [number, number, number];
}

const initialState: StatsModalState = {
  games_played: 0,
  wins: 0,
  longest_streak: 0,
  current_streak: 0,
  attempts_distribution: [0, 0, 0],
};

const computeWeightedAvg = (arr: [number, number, number], wins: number): number => {
  if (wins === 0) return 0;
  return (1 * arr[0] + 2 * arr[1] + 3 * arr[2]) / wins;
};

const computeWinPercentage = (wins: number, games_played: number): string => {
  return games_played === 0 ? "0.0" : (100 * (wins / games_played)).toFixed(1);
};

export const StatsModal: React.FC<GenericModalsPropsInterface> = ({ isOpen, onOpenChange }) => {
  const [stats, setStats] = useState<StatsModalState>(initialState);
  const [avgAttempts, setAvgAttempts] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      const user_id = localStorage.getItem("rank_five_user_id");
      if (!user_id) {
        console.error("User ID is missing in localStorage");
        return;
      }

      try {
        const response = await apiClient.get(`/users/stats/${user_id}`);
        const fetchedStats = response.data;
        setStats(fetchedStats);

        setAvgAttempts(computeWeightedAvg(fetchedStats.attempts_distribution, fetchedStats.wins));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  return (
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
            <ModalHeader className="flex flex-col gap-1 text-3xl">Your Stats</ModalHeader>
            <ModalBody>
              <div className="flex flex-wrap justify-around gap-8 my-4">
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-2/3 md:w-[40%] rounded-xl">
                  <StatsBox value={String(stats.games_played)} context="Games Played" />
                </div>
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${computeWinPercentage(stats.wins, stats.games_played)}%`} context="Win Percentage" />
                </div>
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${stats.current_streak}`} context="Current Streak" />
                </div>
                <div className="h-28 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${stats.longest_streak}`} context="Longest Streak" />
                </div>
                <div className="h-28 p-2 bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                  <StatsBox value={`${avgAttempts.toFixed(2)}`} context="Avg. Attempts Per Win" />
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
