import React from "react";
import { GuideModal } from "../Modals/GuideModal";
import { StatsModal } from "../Modals/StatsModal";
import { useDisclosure, Button } from "@nextui-org/react";
import { QuestionMarkCircledIcon, BarChartIcon } from "@radix-ui/react-icons";

export const Nav: React.FC = () => {
  // Using destructuring with aliases to avoid name conflicts
  const { isOpen: isGuideModalOpen, onOpen: openGuideModal, onOpenChange: onGuideModalChange } = useDisclosure();

  const { isOpen: isStatsModalOpen, onOpen: openStatsModal, onOpenChange: onStatsModalChange } = useDisclosure();

  return (
    <div className="bg-gray-700 text-white text-center drop-shadow-xl flex flex-row justify-between items-stretch py-2">
      <div className="w-[15%] py-2 flex items-center justify-center">
        <Button
          color="default"
          className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent hover:border-white transition ease-in-out delay-150"
          startContent={<BarChartIcon className="scale-[150%] text-white md:mr-2" />}
          onClick={openStatsModal}
        >
          <span className="hidden md:inline text-xl text-white">Statistics</span>
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center flex-shrink">
        <h1 className="font-semibold text-4xl underline underline-offset-4">NBA Rank 6</h1>
      </div>

      <div className="w-[15%] py-2 flex items-center justify-center flex-shrink">
        <Button
          color="default"
          className="text-medium px-2 md:px-6 md:py-2 rounded-full md:rounded-lg bg-transparent border-2 border-transparent hover:border-white transition ease-in-out delay-150"
          startContent={<QuestionMarkCircledIcon className="scale-[150%] text-white md:mr-2" />}
          onClick={openGuideModal}
        >
          <span className="hidden md:inline text-xl text-white">Guide</span>
        </Button>
      </div>

      <GuideModal isOpen={isGuideModalOpen} onOpenChange={onGuideModalChange} />
      <StatsModal isOpen={isStatsModalOpen} onOpenChange={onStatsModalChange} />
    </div>
  );
};
