import React, { useEffect, useState } from "react";
import { Drag } from "../Components/Game/Draggable";
import { GuessCrumbs } from "../Components/Game/GuessCrumbs";
import { Nav } from "../Components/Nav/Nav";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import { Toaster, toast } from "sonner";
import { SolutionModal } from "../Components/Modals/SolutionModal";
import { useDisclosure } from "@nextui-org/react";
import {
  initializeGame,
  resetGameState,
} from "../Store/Snapshot/snapshotSlice";
import { MAX_ATTEMPTS } from "../Utils/globals";
import {
  evaluateAttempt,
  fetchSession,
  initializeNewSession,
} from "../Api/Lib/Session";
import { createNewUser } from "../Api/Lib/User";
import {
  resetGameLocalStorage,
  initializeNewUserLocalStorage,
} from "../Utils/game";

export const Main = () => {
  const dispatch = useDispatch();
  const attempts = useSelector((state: RootState) => state.snapshot.attempts);
  const [scores, setScores] = useState<number[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const initializeUser = async () => {
    const user = await createNewUser();

    const newUserId = user.user_id;
    const newSessionId = user.session_id;
    const players = user.players;

    return {
      newUserId,
      newSessionId,
      players,
    };
  };

  useEffect(() => {
    // (1) New user. Create new user and session
    // (2) Old user, session over. Check local storage first to see session status. If status inactive, start new session.
    // (3) Old user, ongoing session. Check local storage to see if session status is 0. If so, retrieve active session.

    // internal functions - retrieveSession, checkUser. TODO: Add 1 for initializing new session.
    const retrieveSession = async (
      user_id: string | null,
      session_id: string | null,
    ) => {
      const session = await fetchSession(user_id, session_id);
      dispatch(
        initializeGame({
          players: session.players,
        }),
      );
    };

    const createNewUser = async () => {
      const { newUserId, newSessionId, players } = await initializeUser();
      return {
        newUserId,
        newSessionId,
        players,
      };
    };

    // main setup client func. Uses above internal funcs
    const setupClient = async () => {
      const userIdLocalStorage = localStorage.getItem("rank_five_user_id");

      if (!userIdLocalStorage) {
        // initialize new user
        const { newUserId, newSessionId, players } = await createNewUser();
        initializeNewUserLocalStorage(newUserId, newSessionId);
        dispatch(
          initializeGame({
            players: players,
          }),
        );
      } else {
        console.log("92");
        // check if session is active or expired.
        const sessionStatusLocalStorage = localStorage.getItem(
          "rank_five_session_status",
        );

        if (sessionStatusLocalStorage) {
          console.log("97");

          const session_status = Number(JSON.parse(sessionStatusLocalStorage));

          // active session
          if (session_status === 0) {
            console.log("103");

            //TODO: Check. May need to do a dispatch to update last guess, attempts, status
            await retrieveSession(
              localStorage.getItem("rank_five_user_id"),
              localStorage.getItem("rank_five_session_id"),
            );
          }

          // inactive session. Either user lost or won
          else {
            console.log("112");

            const session = await initializeNewSession(
              localStorage.getItem("rank_five_user_id"),
            );
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
    if (attempts > 0) {
      const foo = async () => {
        const guessesArray = JSON.parse(
          localStorage.getItem("rank_five_last_guess") || "[]",
        );
        const result = await evaluateAttempt(
          localStorage.getItem("rank_five_user_id"),
          localStorage.getItem("rank_five_session_id"),
          guessesArray,
          attempts,
        );
        console.log(`New session status: ${result?.session_status}`);
        console.log(result);
        setScores(result?.scores);

        localStorage.setItem("rank_five_session_status", JSON.stringify(result?.session_status))
      };

      foo();
    }

    // if (attempts > 0 && localStorage.getItem("rank_five_session_status") && Number(JSON.parse(localStorage.getItem("rank_five_session_status") || "")) === 0) {
    //   console.log('Check condition in 138');
    //   const guessesLocalStorage = localStorage.getItem("rank_five_last_guess");
    //   console.log(JSON.parse(guessesLocalStorage || ""));

    //   if (guessesLocalStorage) {
    //     console.log("141");
    //     const scores_array = generateScoresArray(JSON.parse(guessesLocalStorage), snapshot.solution_map);
    //     const correct_score = scores_array.filter(item => item === 0).length;
    //     setCorrect(correct_score);
    //     console.log(correct);
    //     // user won
    //     if (correct_score === CORRECT_GUESSES) {
    //       localStorage.setItem("rank_five_session_status", JSON.stringify(1));
    //       console.log("Winner winner chicken dinner");
    //       onOpen();
    //     }
    //     else if (attempts === MAX_ATTEMPTS) {
    //       localStorage.setItem("rank_five_session_status", JSON.stringify(-1));
    //       onOpen();
    //       console.log("142 ran");
    //     }
    //     else {
    //       console.log('Toaster ran now 161')
    //         toast(
    //           `You got ${correct_score} guess${
    //             correct_score === 1 ? "" : "es"
    //           } right!`,
    //           {
    //             position: "top-center",
    //             duration: 3000,
    //           },
    //         );
    //     }
    //   }

    // }
  }, [attempts]);

  return (
    <div className="w-full h-full flex flex-col pb-4">
      <Nav />
      <Toaster position="top-center" />
      <SolutionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        correctGuesses={5}
        attempts={attempts}
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
        scores={scores}
      />
      <Drag />
    </div>
  );
};
