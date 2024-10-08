import React from 'react'

interface StatsBoxProps {
  value: string;
  context: string;
}

export const StatsBox: React.FC<StatsBoxProps> = ({ value, context }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {/* Adjusting the number size back down and keeping it bold */}
      <div className="text-4xl font-bold">{value}</div>

      {/* Larger contextual text with a narrower width to force word wrapping */}
      <div className="text-center text-xl font-medium mt-2 w-full break-words">
        {context}
      </div>
    </div>
  );
};
