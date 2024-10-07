import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { PlayerDataInterface } from "../../Types/store";

type GuessCrumbsType = {
  isVisible: boolean
}

export const GuessCrumbs = (props: GuessCrumbsType) => {

  const snapshot = useSelector((state: RootState) => state.snapshot);

  return (
    <div className={`w-full mx-auto flex justify-center ${props.isVisible ? 'visible' : 'invisible'}`}>
      <Breadcrumbs className="bg-white rounded mx-auto">
        {snapshot.guesses &&
          snapshot.scores &&
          snapshot.guesses.map((item:PlayerDataInterface, idx:number) => (
            <BreadcrumbItem
              classNames={{
                item: `text-2xl ${snapshot.scores[idx] === 0 ? "text-green-400" : "text-red-400" }`,
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
