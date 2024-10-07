import React, { useEffect } from "react";
import { Drag } from "../Components/Game/Draggable";
import { GuessCrumbs } from "../Components/Game/GuessCrumbs";
import { Nav } from "../Components/Nav";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import { Toaster, toast } from "sonner";
import { SolutionModal } from "../Components/Modals/SolutionModal";
import { useDisclosure } from "@nextui-org/react";
import {
  initializeGame,
  resetGameState,
} from "../Store/Snapshot/snapshotSlice";
import { MAX_ATTEMPTS, CORRECT_GUESSES } from "../Utils/globals";
import { fetchSession, initializeNewSession } from "../Api/Lib/Session";
import { createNewUser } from "../Api/Lib/User";

export const Main = () => {
  const attempts = useSelector((state: RootState) => state.snapshot.attempts);
  const score = useSelector((state: RootState) => state.snapshot.scores);
  const snapshot = useSelector((state: RootState) => state.snapshot);
  const dispatch = useDispatch();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const initializeUser = async () => {
    
    const user = await createNewUser();

    const newUserId = user.user_id;
    const newSessionId = user.session_id;
    const players = user.players;
    const solution_map = user.solution_map;

    return {
      newUserId,
      newSessionId,
      players,
      solution_map,
    };
  };

  useEffect(() => {

    // (1) New user. Create new user and session
    // (2) Old user, session over. Check local storage first to see session status. If status inactive, start new session. 
    // (3) Old user, ongoing session. Check local storage to see if session status is 0. If so, retrieve active session. 


    // internal functions - retrieveSession, checkUser. 
    const retrieveSession = async (user_id: string | null, session_id: string | null) => {

      const session = await fetchSession(user_id, session_id);
      dispatch(
        initializeGame({
          players: session.players,
          solution_map: session.solution_map,
        }),
      );
    };

    const createNewUser = async () => {
      const { newUserId, newSessionId, players, solution_map } = await initializeUser();
      localStorage.setItem("rank_five_user_id", newUserId);
      localStorage.setItem("rank_five_session_id", newSessionId);
      localStorage.setItem("rank_five_session_status", JSON.stringify(0));
      dispatch(
        initializeGame({
          players: players,
          solution_map: solution_map,
        }),
      );    
    }

    // main setup client func. Uses above internal funcs
    const setupClient = async () => {
  
      const userIdLocalStorage = localStorage.getItem("rank_five_user_id");
  
      if (!userIdLocalStorage) {
        // initialize new user here. 
        await createNewUser();
      }
  
      else {
  
        // check if session is active or expired. 
        const sessionStatusLocalStorage = localStorage.getItem("rank_five_session_status");
  
        if (sessionStatusLocalStorage) {

          const session_status = Number(JSON.parse(sessionStatusLocalStorage));
  
          // active session
          if (session_status === 0) {
            await retrieveSession(
              localStorage.getItem("rank_five_user_id"),
              localStorage.getItem("rank_five_session_id"),
            );
          }

          // inactive session. Either user lost or won
  
          else {
            const session = await initializeNewSession(localStorage.getItem("rank_five_user_id"));
          
            dispatch(resetGameState());
  
            dispatch(
              initializeGame({
                players: session.players,
                solution_map: session.solution_map,
              }),
            );
  
            localStorage.setItem(
              "rank_five_session_id",
              session.session_id,
            );
            localStorage.setItem("rank_five_session_status", JSON.stringify(0));
            localStorage.setItem("rank_five_session_attempts", JSON.stringify(0));            
          }
        }
      }

    }

    setupClient();
  }, []);

  useEffect(() => {
    if (score.length > 0) {
      const correctGuesses = score.filter((s) => s !== 1).length;

      if (correctGuesses === CORRECT_GUESSES) {
        localStorage.setItem("rank_five_session_status", JSON.stringify(1));
        onOpen();
      } else {
        if (attempts === MAX_ATTEMPTS) {
          localStorage.setItem("rank_five_session_status", JSON.stringify(-1));
          onOpen();
        } else {
          toast(
            `You got ${correctGuesses} guess${
              correctGuesses === 1 ? "" : "es"
            } right!`,
            {
              position: "top-center",
              duration: 3000,
            },
          );
        }
      }
    }
  }, [score, attempts]);

  return (
    <div className="w-full h-full flex flex-col pb-4">
      <Nav />
      <Toaster position="top-center" />
      <SolutionModal
        correctGuesses={score.filter((s) => s !== 1).length}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <section className="w-3/5 mx-auto text-center my-8">
        <h2 className="font-bold text-white text-3xl">
          ATTEMPTS LEFT: {MAX_ATTEMPTS - attempts}
        </h2>
      </section>
      <GuessCrumbs
        guesses={JSON.parse(
          localStorage.getItem("rank_five_last_guess") || "[]",
        )}
        solution_map={snapshot.solution_map}
      />
      <Drag />
    </div>
  );
};
