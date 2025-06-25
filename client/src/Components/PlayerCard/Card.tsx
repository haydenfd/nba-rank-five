import React from "react";
import { PlayerCardPropsInterface } from "./Types";
import { CircularImage } from "./CircularImage";

export const PlayerCard: React.FC<PlayerCardPropsInterface> = ({ id, name, key = "", code = "", classNames = "" }) => {
  return (
    <div className={`w-full flex flex-row space-x-4 items-center text-center text-black ${classNames}`}>
      <CircularImage
        src={`https://www.basketball-reference.com/req/202106291/images/headshots/${code}.jpg`}
        alt="Basketball player"
        size="w-12 h-14"
        fit="contain"
      />
      <h3 className="text-xl font-medium">{name}</h3>
    </div>
  );
};
