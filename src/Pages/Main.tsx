import React, { useEffect } from "react";
import { Drag } from "../Components/Game/Draggable";
import { GuessCrumbs } from "../Components/Game/GuessCrumbs";
import { Nav } from "../Components/Nav";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import { Toaster, toast } from "sonner";
import { SolutionModal } from "../Components/Modals/SolutionModal";
import { useDisclosure } from "@nextui-org/react";
import axios from "axios";
import {
  initializeGame,
  resetGameState,
} from "../Store/Snapshot/snapshotSlice";
import { MAX_ATTEMPTS } from "../Utils/globals";

export const Main = () => {
  const attempts = useSelector((state: RootState) => state.snapshot.attempts);
  const score = useSelector((state: RootState) => state.snapshot.scores);
  const snapshot = useSelector((state: RootState) => state.snapshot);
  const dispatch = useDispatch();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const initializeUser = async () => {
    const response = await axios.post("http://localhost:8080/users/create");
    const newUserId = response.data.user_id;
    const newSessionId = response.data.session_id;
    const players = response.data.players;
    const solution_map = response.data.solution_map;
    return {
      newUserId,
      newSessionId,
      players,
      solution_map,
    };
  };

  useEffect(() => {
    const fetchSession = async (
      user_id: string | null,
      session_id: string | null,
    ) => {
      console.log(
        `http://localhost:8080/session/retrieve/${user_id}/${session_id}`,
      );
      const response = await axios.get(
        `http://localhost:8080/session/retrieve/${user_id}/${session_id}`,
      );
      const session = response.data;
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
          const endpoint = "http://localhost:8080/session/create";

          const response = await axios.post(endpoint, {
            user_id: localStorage.getItem("rank_five_user_id"),
          });

          dispatch(resetGameState());

          dispatch(
            initializeGame({
              players: response.data.players,
              solution_map: response.data.solution_map,
            }),
          );

          localStorage.setItem(
            "rank_five_session_id",
            response.data.session_id,
          );
          localStorage.setItem("rank_five_session_status", JSON.stringify(0));
          localStorage.setItem("rank_five_session_attempts", JSON.stringify(0));
        } else {
          await fetchSession(
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

      if (correctGuesses === 5) {
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
