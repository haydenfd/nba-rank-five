import React, { useEffect, useState } from "react";
import { Drag } from "../Components/Game/Drag";
import { GuessCrumbs } from "../Components/Game/GuessCrumbs";
import { Nav } from "../Components/Nav/Nav";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import { Toaster, toast } from "sonner";
import { SolutionModal } from "../Components/Modals/SolutionModal";
import { useDisclosure } from "@nextui-org/react";
import { initializeGame, resetGameState } from "../Store/snapshotSlice";
import { MAX_ATTEMPTS } from "../Utils/globals";
import { evaluateAttempt, fetchSession, createSession } from "../Api/Lib/Session";
import { createNewUser } from "../Api/Lib/User";
import { resetGameLocalStorage, initializeNewUserLocalStorage } from "../Utils/game";
// import { apiClient } from "../Api/axiosClient";

export const Main: React.FC = () => {
  const dispatch = useDispatch();
  const attempts = useSelector((state: RootState) => state.snapshot.attempts);
  const [scores, setScores] = useState<number[]>([]);

  const { isOpen: isOpenSolutionModal, onOpen: onOpenSolutionModal, onOpenChange: onOpenSolutionModalChange } = useDisclosure();

  // useEffect(() => {
  //   const test = async () => {
  //     const response = await apiClient.put("/session/evaluate", {});
  //     console.log(response.data);
  //   }
  //   test();
  // }, [])
  useEffect(() => {
    // (1) New user. Create new user and session
    // (2) Old user, session over. Check local storage first to see session status. If status inactive, start new session.
    // (3) Old user, ongoing session. Check local storage to see if session status is 0. If so, retrieve active session.

    // internal functions - retrieveSession, checkUser. TODO: Add 1 for initializing new session.
    const handleFetchSession = async (user_id: string | null, session_id: string | null) => {
      if (user_id && session_id) {
        const session = await fetchSession(user_id, session_id);
        dispatch(
          initializeGame({
            players: session.players,
          }),
        );
      }
    };

    const handleCreateNewUser = async () => {
      const { user_id, session_id, players } = await createNewUser();
      return {
        user_id,
        session_id,
        players,
      };
    };

    // main setup client func. Uses above internal funcs
    const setupClient = async () => {
      const userIdLocalStorage = localStorage.getItem("rank_five_user_id");

      if (!userIdLocalStorage) {
        // initialize new user
        const { user_id, session_id, players } = await handleCreateNewUser();
        initializeNewUserLocalStorage(user_id, session_id);
        dispatch(
          initializeGame({
            players: players,
          }),
        );
      } else {
        console.log("92");
        // check if session is active or expired.
        const sessionStatusLocalStorage = localStorage.getItem("rank_five_session_status");

        if (sessionStatusLocalStorage) {
          const session_status = Number(JSON.parse(sessionStatusLocalStorage));

          // active session
          if (session_status === 0) {
            console.log("103");

            //TODO: Check. May need to do a dispatch to update last guess, attempts, status
            await handleFetchSession(localStorage.getItem("rank_five_user_id"), localStorage.getItem("rank_five_session_id"));
          }

          // inactive session. Either user lost or won
          else {
            const session = await createSession(localStorage.getItem("rank_five_user_id"));
            resetGameLocalStorage(session.session_id);
            dispatch(resetGameState());

            dispatch(
              initializeGame({
                players: session.players,
              }),
            );
          }
        }
      }
    };

    setupClient();
  }, [dispatch]);

  useEffect(() => {
    // Problem - this use effect runs on refreshing website. Right after game is done.
    if (attempts > 0 && Number(JSON.parse(localStorage.getItem("rank_five_session_status") || "0")) === 0) {
      const handleAttempt = async () => {
        const guessesArray = JSON.parse(localStorage.getItem("rank_five_last_guess") || "[]");
        const response_data = await evaluateAttempt(
          localStorage.getItem("rank_five_user_id"),
          localStorage.getItem("rank_five_session_id"),
          guessesArray,
          attempts,
        );

        setScores(response_data.scores);

        if (response_data.session_status === 0) {
          toast(
            `You got ${response_data.scores.filter((s: number) => s !== 1).length} guess${
              response_data.scores.filter((s: number) => s !== 1).length === 1 ? "" : "es"
            } right!`,
            {
              position: "top-center",
              duration: 3000,
            },
          );
        } else {
          const sol = response_data.solution;

          if (sol) {
            localStorage.setItem("rank_five_session_solution", JSON.stringify(response_data.solution));
            onOpenSolutionModal();
          }
        }

        localStorage.setItem("rank_five_session_status", JSON.stringify(response_data.session_status));
      };

      handleAttempt();
    }
  }, [attempts]);

  return (
    <div className="w-full h-full flex flex-col pb-4">
      <Nav />
      <Toaster position="top-center" duration={1750} />
      <SolutionModal
        isOpen={isOpenSolutionModal}
        onOpenChange={onOpenSolutionModalChange}
        scores={scores}
        solution={JSON.parse(localStorage.getItem("rank_five_session_solution") || "[]")}
      />
      <section className="w-3/5 mx-auto text-center my-8">
        <h2 className="font-bold text-white text-2xl">ATTEMPTS LEFT: {MAX_ATTEMPTS - attempts}</h2>
      </section>
      <GuessCrumbs
        guesses={JSON.parse(localStorage.getItem("rank_five_last_guess") || "[]")}
        scores={scores}
        isVisible={JSON.parse(localStorage.getItem("rank_five_last_guess") || "[]").length > 0}
      />
      <Drag />
    </div>
  );
};
