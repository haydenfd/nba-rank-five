import React from "react";
import { StatsBoxPropsInterface } from "../../Types/modals";

export const StatsBox: React.FC<StatsBoxPropsInterface> = ({ value, context }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-center text-xl font-medium mt-2 w-full break-words">{context}</div>
    </div>
  );
};
