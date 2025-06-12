import React, { createContext, useContext, useState, ReactNode } from "react";

export type PlayerType = {
    PLAYER_ID: number;
    PLAYER_NAME: string;
    CODE: string;
    PPG?: number;
    APG?: number;
    RPG?: number;
    GP?: number;
}

export type CategoryType = "PPG" | "GP" | "APG" | "RPG" | "";
export type AttemptsType = 0 | 1 | 2 | 3;
export type lastGuessesAttemptType = number[] | [];
export type lastGuessesCorrectType = number | null;

interface GameContextType {
    players: PlayerType[];
    setPlayers: (players: PlayerType[]) => void;
    category: CategoryType;
    setCategory: (category: CategoryType) => void;
    attempts: AttemptsType;
    setAttempts: (attempts: AttemptsType) => void;
    lastGuessesAttempt: lastGuessesAttemptType;
    setLastGuessesAttempt: (lastAttempt: lastGuessesAttemptType) => void;
    resetToLastGuessAttempt: () => void;
    lastGuessesCorrect: lastGuessesCorrectType;
    setLastGuessesCorrect: (lastAttemptCorrect: lastGuessesCorrectType) => void; 
}


const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: {children: ReactNode }) => {

    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [category, setCategory] = useState<CategoryType>("PPG");
    const [attempts, setAttempts] = useState<AttemptsType>(0);
    const [lastGuessesAttempt, setLastGuessesAttempt] = useState<lastGuessesAttemptType>([]);
    const [lastGuessesCorrect, setLastGuessesCorrect] = useState<lastGuessesCorrectType>(null);

    const resetToLastGuessAttempt = () => {
        if (lastGuessesAttempt.length > 0) {
          const reorderedPlayers = lastGuessesAttempt
            .map(id => players.find(p => p.PLAYER_ID === id))
            .filter((p): p is PlayerType => p !== undefined);
          setPlayers(reorderedPlayers);
        }
      };

    return (
        <GameContext.Provider
        value={{
            players, 
            setPlayers,
            attempts,
            setAttempts,
            category,
            setCategory,
            lastGuessesAttempt, 
            setLastGuessesAttempt,
            resetToLastGuessAttempt,
            lastGuessesCorrect,
            setLastGuessesCorrect
        }}
        >
            {children}
        </GameContext.Provider>
    )
}


export const useGameContext = () => {
    const ctx = useContext(GameContext);

    if (!ctx) {
        throw new Error("Wrap useGameContext within GameProvider");
    }

    return ctx;
}