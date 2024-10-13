import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { PlayerDataInterface } from "../../Types/store";
import { GuessCrumbsPropsInterface } from "../../Types/game";

export const GuessCrumbs: React.FC<GuessCrumbsPropsInterface> = ({ guesses, scores, isVisible = false }) => {
  const [_scores, setScores] = useState<Number[]>([]);

  useEffect(() => {
    setScores(scores);
  }, [guesses, scores]);

  return (
    <Breadcrumbs className={`max-w-[90%] mx-auto flex justify-center ${isVisible ? "visible" : "invisible"} bg-white p-2 rounded-xl`}>
      {guesses &&
        guesses.map((item: PlayerDataInterface, idx: number) => (
          <BreadcrumbItem
            key={idx}
            classNames={{
              item: `text-xl ${_scores[idx] === 0 ? "text-green-400" : "text-red-400"}`,
              separator: `text-xl text-black font-extrabold`,
            }}
            disableAnimation={true}
          >
            {item.PLAYER_NAME}
          </BreadcrumbItem>
        ))}
    </Breadcrumbs>
  );
};
