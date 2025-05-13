import React, { useEffect, useState } from "react";
import { Drag } from "../Components/Game/Drag";
import { Toaster } from "sonner";
import { GuideModal } from "../Components/Modals/GuideModal";
import { StatsModal } from "../Components/Modals/StatsModal";
import { createSession, createUser, fetchSession, fetchUser } from "../Api/services";
import { useDisclosure, Button } from "@nextui-org/react";
import { QuestionMarkCircledIcon, BarChartIcon } from "@radix-ui/react-icons";
import { useStatsContext } from "../Context/StatsContext";

interface CircularImageProps {
  src: string;
  alt: string;
  size?: string;
  fit?: 'contain' | 'cover' | 'scale-down';
}

export const CircularImage: React.FC<CircularImageProps> = ({
  src,
  alt,
  size = 'w-24 h-24',
  fit = 'contain'
}) => {
  return (
    <div className={`${size} rounded-full overflow-hidden flex items-center justify-center bg-white ml-4`}>
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className={`max-w-full max-h-full object-${fit}`}
        />
      </div>
    </div>
  );
};
export default CircularImage;

type AttemptsType = 0 | 1 | 2;

export const Main: React.FC = () => {
  const [x, setX] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<AttemptsType>(0);
  const { isOpen: isGuideModalOpen, onOpen: openGuideModal, onOpenChange: onGuideModalChange } = useDisclosure();
  const { isOpen: isStatsModalOpen, onOpen: openStatsModal, onOpenChange: onStatsModalChange } = useDisclosure();
  const {updateStats} = useStatsContext();
  useEffect(() => {
    const initializeGame = async () => {
      const userIdLocalStorage = localStorage.getItem("ranked_user_id");

      try {

        if (!userIdLocalStorage) {
          openGuideModal();
          const userResponse = await createUser();
          const userId = userResponse.user_id;
          localStorage.setItem("ranked_user_id", userId);
          const sessionResponse = await createSession(userId);
          setX(sessionResponse.players);
          // localStorage.setItem("x", JSON.stringify(sessionResponse.solution));
          // localStorage.setItem("ranked_game_state", JSON.stringify(0));
          
        } else {
          // const gameStateLocalStorage = JSON.parse("ranked_game_state") as number;
          const userResponse = await fetchUser(userIdLocalStorage);


          updateStats(userResponse);
          const sessionResponse = await fetchSession(userIdLocalStorage);
          setX(sessionResponse.players);
        }
    
      } catch (error) {
        console.error("Error initializing game:", error);
      }
    };

    initializeGame();
  }, []);

  return (
    <div className="w-full h-full flex flex-col pb-4">
      <div className="bg-gray-700 text-white text-center drop-shadow-xl flex flex-row justify-between items-stretch py-2">
      <div className="w-[15%] py-2 flex items-center justify-center">
        <Button
          color="default"
          className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent "
          startContent={<BarChartIcon className="scale-[225%] text-white" />}
          onClick={openStatsModal}
        >
          {/* <span className="hidden md:inline text-xl text-white">Statistics</span> */}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center flex-shrink">
        <h1 className="font-semibold text-4xl underline underline-offset-4">NBA Ranked</h1>
      </div>

      <div className="w-[15%] py-2 flex items-center justify-center flex-shrink">
        <Button
          color="default"
          className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent "
          startContent={<QuestionMarkCircledIcon className="scale-[225%] text-white" />}
          onClick={openGuideModal}
        >
          {/* <span className="hidden md:inline text-xl text-white">Guide</span> */}
        </Button>
      </div>

      <GuideModal isOpen={isGuideModalOpen} onOpenChange={onGuideModalChange} />
        <StatsModal isOpen={isStatsModalOpen} onOpenChange={onStatsModalChange} />
    </div>
      <Toaster position="top-center" duration={1750} />
      {x && <Drag playersList={x} attempts={attempts} handleAttempts={setAttempts}/>}
    </div>
  );
};
