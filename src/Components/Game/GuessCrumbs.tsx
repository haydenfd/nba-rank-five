import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { generateScoresArray } from "../../Utils/game";
import { PlayerDataInterface, SolutionMapInterface } from "../../Types/store";

interface GuessCrumbsProps {
  guesses: PlayerDataInterface[];
  solution_map: SolutionMapInterface;
  isVisible?: boolean;
}

export const GuessCrumbs: React.FC<GuessCrumbsProps> = ({
  guesses,
  solution_map,
  isVisible = true,
}) => {
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    const temp = generateScoresArray(guesses, solution_map);
    setScores(temp);
  }, [guesses, solution_map]);

  return (
    <div
      className={`w-full mx-auto flex justify-center ${isVisible ? "visible" : "invisible"}`}
    >
      <Breadcrumbs className="bg-white rounded mx-auto">
        {guesses &&
          guesses.map((item: PlayerDataInterface, idx: number) => (
            <BreadcrumbItem
              key={idx}
              classNames={{
                item: `text-2xl ${scores[idx] === 0 ? "text-green-400" : "text-red-400"}`,
                separator: `text-2xl text-black font-bold`,
              }}
              disableAnimation={true}
            >
              {item.PLAYER_NAME}
            </BreadcrumbItem>
          ))}
      </Breadcrumbs>
    </div>
  );
};
