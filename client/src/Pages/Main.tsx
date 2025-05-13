import React, { useEffect, useState } from "react";
import { Drag } from "../Components/Game/Drag";
import { Nav } from "../Components/Nav/Nav";
import { Toaster } from "sonner";
import { GuideModal } from "../Components/Modals/GuideModal";
import { useDisclosure } from "@nextui-org/react";
import { createSession, createUser, fetchUser } from "../Api/services";

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
  const { isOpen: isOpenSolutionModal, onOpen: onOpenSolutionModal, onOpenChange: onOpenSolutionModalChange } = useDisclosure();

  useEffect(() => {
    const initializeGame = async () => {
      const userIdLocalStorage = localStorage.getItem("ranked_user_id");

      try {

        if (!userIdLocalStorage) {
          const userResponse = await createUser();
          const userId = userResponse.user_id;
          localStorage.setItem("ranked_user_id", userId);
          const sessionResponse = await createSession(userId);
          setX(sessionResponse.players);
          localStorage.setItem("x", JSON.stringify(sessionResponse.solution));
          localStorage.setItem("ranked_game_state", JSON.stringify(0));
        } else {
          console.log("Found user id!")
          const userResponse = await fetchUser(userIdLocalStorage);

          const sessionResponse = await createSession(userIdLocalStorage);
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
      <Nav />
      <Toaster position="top-center" duration={1750} />
      {x && <Drag playersList={x} attempts={attempts} handleAttempts={setAttempts}/>}
      <GuideModal isOpen={isGuideModalOpen} onOpenChange={onGuideModalChange} />
    </div>
  );
};
