import React from "react";
import { GuideModal } from "../Modals/GuideModal";
import { StatsModal } from "../Modals/StatsModal";

export const Nav = () => {
  return (
    <div className="bg-gray-700 text-white text-center drop-shadow-xl flex flex-row justify-between items-stretch py-2">
      <div className="w-[15%] py-2 flex items-center justify-center">
        <StatsModal />
      </div>
      <div className="flex-1 flex items-center justify-center flex-shrink">
        <h1 className="font-semibold text-4xl underline underline-offset-4">
          NBA Rank 5
        </h1>
      </div>
      <div className="w-[15%] py-2 flex items-center justify-center flex-shrink">
        <GuideModal />
      </div>
    </div>
  );
};
