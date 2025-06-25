import React from "react";
import { PlayerCardPropsInterface } from "./Types";
import { CircularImage } from "./CircularImage";

export const SolutionCard: React.FC<PlayerCardPropsInterface> = ({ id, name, key = "", ppg = "", color = "white", code = "", classNames = "" }) => {
  return (
    <div className={`w-full flex flex-row items-center bg-slate-400 justify-between text-${color} ${classNames}`}>
      <div className="flex flex-row items-center space-x-4">
        <CircularImage
          src={`https://www.basketball-reference.com/req/202106291/images/headshots/${code}.jpg`}
          alt={`${name}`}
          size="w-12 h-12"
          fit="contain"
        />
        <h3 className="text-xl font-medium">{name}</h3>
      </div>
      <h2 className="text-xl font-medium mr-4">{ppg}</h2>
    </div>
  );
};
