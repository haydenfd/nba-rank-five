import React from "react";
import { StatsBoxPropsInterface } from "./Types";

export const StatsBox: React.FC<StatsBoxPropsInterface> = ({ value, ctx }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-center text-xl font-medium mt-2 w-full break-words">{ctx}</div>
    </div>
  );
};
