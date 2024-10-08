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

export function StatsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stats, setStats] = useState<StatsModalState>(initialState);

  useEffect(() => {
    const fetchStats = async () => {
      console.log("Modal open, fetching stats");

      const user_id = localStorage.getItem("rank_five_user_id");
      if (!user_id) {
        console.error("User ID is missing in localStorage");
        return;
      }

      try {
        const response = await apiClient.get(`/users/stats/${user_id}`);
        setStats(response.data); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    // Only fetch stats when the modal is opened
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        color="default"
        className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent hover:border-white transition ease-in-out delay-150"
        startContent={
          <BarChartIcon className="scale-[150%] text-white md:mr-2" />
        }
        onClick={onOpen}
      >
        <span className="hidden md:inline text-xl text-white">Statistics</span>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Here are your stats!
              </ModalHeader>
              <ModalBody>
                <p>You've played: {stats.games_played} games</p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
