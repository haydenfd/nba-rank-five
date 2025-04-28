import React, { useEffect, useState } from "react";
import { Drag } from "../Components/Game/Drag";
import { Nav } from "../Components/Nav/Nav";
import { Toaster } from "sonner";
import { SolutionModal } from "../Components/Modals/SolutionModal";
import { MAX_ATTEMPTS } from "../Utils/globals";
import { GuideModal } from "../Components/Modals/GuideModal";
import { useDisclosure } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
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
    const createSession = async (user_id: string) => {
      try {
        const res = await fetch("https://nkc0fg59d8.execute-api.us-west-1.amazonaws.com/dev/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }), 
        });
        const data = await res.json();
        console.log("Session created:", data);
        setX(data.players)
        return data; 
      } catch (error) {
        console.error("Error creating session:", error);
        throw error;
      }
    };
    
  
    const createUser = async () => {
      try {
        const res = await fetch("https://nkc0fg59d8.execute-api.us-west-1.amazonaws.com/dev/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), 
        });
        const data = await res.json();
        console.log("Created user ID:", data.user.user_id);
        localStorage.setItem("rankd_user_id", data.user.user_id);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };


    createUser();
    createSession(localStorage.getItem("rankd_user_id") || "");
  }, []);


  return (
    <div className="w-full h-full flex flex-col pb-4">
      <Nav />
      <Toaster position="top-center" duration={1750} />
      {/* <SolutionModal
        isOpen={isOpenSolutionModal}
        onOpenChange={onOpenSolutionModalChange}
        scores={scores}
        solution={JSON.parse(localStorage.getItem("rank_five_session_solution") || "[]")}
      /> */}

{/* 
      {attempts === MAX_ATTEMPTS || Number(JSON.parse(localStorage.getItem("rank_five_session_status") || "0")) !== 0 ? (
            <Button
            onClick={onOpenSolutionModal}
            className="p-6 bg-slate-300 border-[6px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 w-[20%] mx-auto hover:border-black"
          >
            Solution
          </Button>
      ) : (
            <GuessCrumbs
              guesses={JSON.parse(localStorage.getItem("rank_five_last_guess") || "[]")}
              scores={scores}
              isVisible={JSON.parse(localStorage.getItem("rank_five_last_guess") || "[]").length > 0}
            />
      ) } */}
      {x.length > 0 && <Drag playersList={x} attempts={attempts} handleAttempts={setAttempts}/>}
      <GuideModal isOpen={isGuideModalOpen} onOpenChange={onGuideModalChange} />

    </div>
  );
};
