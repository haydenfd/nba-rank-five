import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { PlayerDataInterface } from "../../Types/store";

interface GuessCrumbsProps {
  guesses: PlayerDataInterface[];
  scores: Number[];
  isVisible?: boolean;
}

export const GuessCrumbs: React.FC<GuessCrumbsProps> = ({
  guesses,
  scores,
  isVisible = true,
}) => {
  const [_scores, setScores] = useState<Number[]>([]);

  useEffect(() => {
    setScores(scores);
    console.log("crumbs useeffect")
  }, [guesses, scores]);

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
                item: `text-2xl ${_scores[idx] === 0 ? "text-green-400" : "text-red-400"}`,
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
