import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { BarChartIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { apiClient } from "../../Api/axiosClient";
import { StatsBox } from "../Game/StatsBox";

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

const computedWeightedAvg = (arr: [number, number, number], wins: number): number => {
  console.log(wins);
  console.log(arr);
  if (wins === 0) return 0; // Handle the case when wins is 0 to avoid division by zero.
  return (1 * arr[0] + 2 * arr[1] + 3 * arr[2]) / wins;
};

export function StatsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

        // Compute the weighted average after stats are updated
        setAvgAttempts(computedWeightedAvg(fetchedStats.attempts_distribution, fetchedStats.wins));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);
  return (
    <>
      <Button
        color="default"
        className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent hover:border-white transition ease-in-out delay-150"
        startContent={<BarChartIcon className="scale-[150%] text-white md:mr-2" />}
        onClick={onOpen}
      >
        <span className="hidden md:inline text-xl text-white">Statistics</span>
      </Button>
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
              <ModalHeader className="flex flex-col gap-1 text-3xl">
                Your Stats
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-wrap justify-around gap-8 my-4">
                  <div className="h-28 p-2 bg-gray-700 text-white  flex justify-center items-center sm:w-2/3 md:w-[40%] rounded-xl">
                    <StatsBox value={String(stats.games_played)} context="Games Played" />
                  </div>
                  <div className="h-28 p-2 bg-gray-700 text-white  flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                    <StatsBox value={`${(100 * (stats.wins / stats.games_played)).toFixed(1)}%`} context="Win Percentage" />
                  </div>
                  <div className="h-28 p-2 bg-gray-700 text-white  flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
                    <StatsBox value={`${stats.current_streak}`} context="Current Streak" />
                  </div>
                  <div className="h-28  bg-gray-700 text-white flex justify-center items-center sm:w-1/2 md:w-[40%] rounded-xl">
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
    </>
  );
}
