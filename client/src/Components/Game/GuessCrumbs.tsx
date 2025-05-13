import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import React from "react";
import { PlayerDataInterface } from "../../Types/store";
import { GuessCrumbsPropsInterface } from "../../Types/game";

export const GuessCrumbs: React.FC<GuessCrumbsPropsInterface> = ({ guesses, isVisible = false }) => {

  return (
    <Breadcrumbs className={`max-w-[90%] mx-auto flex justify-center p-2 ${isVisible ? "bg-white" : "bg-transparent"}  rounded-xl`}>
      {guesses &&
        guesses.map((item: PlayerDataInterface, idx: number) => (
          <BreadcrumbItem
            key={idx}
            classNames={{
              item: `text-xl text-black`,
              separator: `text-xl text-black font-extrabold scale-125`,
            }}
            disableAnimation={true}
          >
            {item.PLAYER_NAME}
          </BreadcrumbItem>
        ))}
    </Breadcrumbs>
  );
};
