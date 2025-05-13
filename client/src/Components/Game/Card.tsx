import React from "react";
import { CardPropsInterface } from "../../Types/game";
import CircularImage from "../../Pages/Main";

export const Card: React.FC<CardPropsInterface> = ({ id, name, ppg = "", color = "black", code="" }) => {

  return (
    <div className={`w-full flex flex-row space-x-4 items-center text-center text-${color}`}>
      <CircularImage 
      src={`https://www.basketball-reference.com/req/202106291/images/headshots/${code}.jpg`} 
      alt="Basketball player" 
      size="w-12 h-14"
      fit="contain"
      />
      <h3 className="text-xl font-medium">{name}</h3>
      <h2 className="text-xl font-medium mr-0">{ppg}</h2>
    </div>
  );
};
