import React, { createContext, useContext, useState, ReactNode } from "react";

type StatsType = {
  games_played: number;
  games_won: number;
  attempts_per_win_distro: [number, number, number];
  curr_streak: number;
  longest_streak: number;
};

type StatsContextType = {
  stats: StatsType;
  updateStats: (newState: StatsType) => void;
};

const defaultStats: StatsType = {
  games_played: 0,
  games_won: 0,
  attempts_per_win_distro: [0, 0, 0],
  curr_streak: 0,
  longest_streak: 0,
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<StatsType>(defaultStats);

  const updateStats = (newState: StatsType) => {
    setStats(newState);
  };

  return <StatsContext.Provider value={{ stats, updateStats }}>{children}</StatsContext.Provider>;
};

export const useStatsContext = () => {
  const ctx = useContext(StatsContext);

  if (!ctx) {
    throw new Error("useStatsContext must be used within a StatsContextProvider");
  }

  return ctx;
};
