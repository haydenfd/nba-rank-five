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

    const retrieveSession = async (user_id: string | null, session_id: string | null) => {

      const session = await fetchSession(user_id, session_id);
      dispatch(
        initializeGame({
          players: session.players,
          solution_map: session.solution_map,
        }),
      );
    };

    const checkUser = async () => {
      const storedUserId = localStorage.getItem("rank_five_user_id");

      if (!storedUserId) {
        const { newUserId, newSessionId, players, solution_map } =
          await initializeUser();
        localStorage.setItem("rank_five_user_id", newUserId);
        localStorage.setItem("rank_five_session_id", newSessionId);
        localStorage.setItem("rank_five_session_status", JSON.stringify(0));
        dispatch(
          initializeGame({
            players: players,
            solution_map: solution_map,
          }),
        );
      } else {
        // retrieve the current session.
        if (
          localStorage.getItem("rank_five_session_status") &&
          Number(localStorage.getItem("rank_five_session_status")) !== 0
        ) {

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
        } else {
          await retrieveSession(
            localStorage.getItem("rank_five_user_id"),
            localStorage.getItem("rank_five_session_id"),
          );
        }
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (score.length > 0) {
      const correctGuesses = score.filter((s) => s !== 1).length;

      if (correctGuesses === CORRECT_GUESSES) {
        localStorage.setItem("rank_five_session_status", JSON.stringify(1));
        onOpen();
      } else {
        if (attempts === MAX_ATTEMPTS) {
          onOpen();
          localStorage.setItem("rank_five_session_status", JSON.stringify(-1));
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
