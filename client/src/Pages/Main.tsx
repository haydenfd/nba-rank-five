import React, { useEffect } from "react";
import { Drag } from "../Components/Game/Drag";
import { GuideModal } from "../Components/Modals/GuideModal";
import { StatsModal } from "../Components/Modals/StatsModal";
import { createSession, createUser, fetchSession, fetchUser } from "../Api/services";
import { useDisclosure, Button } from "@heroui/react";
import { QuestionMarkCircledIcon, BarChartIcon } from "@radix-ui/react-icons";
import { useStatsContext } from "../Context/StatsContext";
import { useGameContext } from "../Context/GameContext";

export const Main: React.FC = () => {
  const { setGameState } = useGameContext();

  const { updateStats } = useStatsContext();

  const { isOpen: isGuideModalOpen, onOpen: openGuideModal, onOpenChange: onGuideModalChange } = useDisclosure();

  const { isOpen: isStatsModalOpen, onOpen: openStatsModal, onOpenChange: onStatsModalChange } = useDisclosure();
  useEffect(() => {
    const initGame = async () => {
      const userIdInLocalStorage: string | null = localStorage.getItem("__ranked_user_id");

      // New user
      if (!userIdInLocalStorage) {
        openGuideModal();
        const { user_id } = await createUser();
        const session = await createSession(user_id);
        localStorage.setItem("__ranked_user_id", user_id);
        localStorage.setItem("__ranked_game_state", JSON.stringify(0));

        setGameState({
          players: session.players,
          category: session.category,
          attempts: session.attempts ?? 0,
          lastGuessesAttempt: session.lastGuessesAttempt ?? [],
          lastGuessesCorrect: session.lastGuessesCorrect ?? null,
        });
      }

      // Existing user
      else {
        const { user_id, games_played, games_won, attempts_per_win_distro, longest_streak, curr_streak } = await fetchUser(userIdInLocalStorage);
        console.log(`user`);
        console.log(user_id);
        updateStats({
          games_played,
          games_won,
          attempts_per_win_distro,
          curr_streak,
          longest_streak,
        });
        const ranked_game_state: string | null = localStorage.getItem("__ranked_game_state");

        let session;
        if (!ranked_game_state) {
          session = await fetchSession(userIdInLocalStorage);
        } else {
          session = await createSession(userIdInLocalStorage);
          localStorage.setItem("__ranked_game_state", JSON.stringify(0));
        }

        setGameState({
          players: session.players,
          category: session.category,
          attempts: session.attempts ?? 0,
          lastGuessesAttempt: session.lastGuessesAttempt ?? [],
          lastGuessesCorrect: session.lastGuessesCorrect ?? null,
        });
      }
    };

    initGame();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full h-full flex flex-col pb-4">
      <div className="bg-gray-700 text-white text-center drop-shadow-xl flex flex-row justify-between items-stretch py-2">
        <div className="w-[15%] py-2 flex items-center justify-center">
          <Button
            color="default"
            className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent"
            startContent={<BarChartIcon className="scale-[225%] text-white" />}
            onPress={openStatsModal}
          />
        </div>

        <div className="flex-1 flex items-center justify-center flex-shrink">
          <h1 className="font-semibold text-4xl underline underline-offset-4">NBA Ranked</h1>
        </div>

        <div className="w-[15%] py-2 flex items-center justify-center flex-shrink">
          <Button
            color="default"
            className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent"
            startContent={<QuestionMarkCircledIcon className="scale-[225%] text-white" />}
            onPress={openGuideModal}
          />
        </div>

        <GuideModal isOpen={isGuideModalOpen} onOpenChange={onGuideModalChange} />
        <StatsModal isOpen={isStatsModalOpen} onOpenChange={onStatsModalChange} />
      </div>
      <Drag />
    </div>
  );
};
