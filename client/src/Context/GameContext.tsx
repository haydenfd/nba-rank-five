import React, { createContext, useContext, useState, ReactNode } from "react";

export type PlayerType = {
  PLAYER_ID: number;
  PLAYER_NAME: string;
  CODE: string;
  PPG?: number;
  APG?: number;
  RPG?: number;
  GP?: number;
};

export type CategoryType = "PPG" | "GP" | "APG" | "RPG" | "";
export type AttemptsType = 0 | 1 | 2 | 3;
export type lastGuessesAttemptType = number[] | [];
export type lastGuessesCorrectType = number | null;

export type GameStateType = {
  players: PlayerType[];
  category: CategoryType;
  attempts: AttemptsType;
  lastGuessesAttempt: lastGuessesAttemptType;
  lastGuessesCorrect: lastGuessesCorrectType;
  solution: number[] | undefined;
};

interface GameContextType extends GameStateType {
  setGameState: (updates: Partial<GameStateType>) => void;
  resetToLastGuessAttempt: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const resetToLastGuessAttempt = () => {
    if (gameState.lastGuessesAttempt.length > 0) {
      const reorderedPlayers = gameState.lastGuessesAttempt
        .map(id => gameState.players.find(p => p.PLAYER_ID === id))
        .filter((p): p is PlayerType => p !== undefined);

      setGameState({ players: reorderedPlayers });
    }
  };

  const [gameState, _setGameState] = useState<GameStateType>({
    players: [],
    category: "PPG",
    attempts: 0,
    lastGuessesAttempt: [],
    lastGuessesCorrect: null,
    solution: undefined,
  });

  const setGameState = (updates: Partial<GameStateType>) => {
    _setGameState(prev => ({ ...prev, ...updates }));
  };
  return (
    <GameContext.Provider
      value={{
        ...gameState,
        setGameState,
        resetToLastGuessAttempt,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const ctx = useContext(GameContext);

  if (!ctx) {
    throw new Error("Wrap useGameContext within GameProvider");
  }

  return ctx;
};
