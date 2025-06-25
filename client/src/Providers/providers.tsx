import { HeroUIProvider } from "@heroui/react";
import { StatsContextProvider } from "../Context/StatsContext";
import { GameProvider } from "../Context/GameContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <StatsContextProvider>
        <GameProvider>{children}</GameProvider>
      </StatsContextProvider>
    </HeroUIProvider>
  );
}
