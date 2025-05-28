import React, { createContext, useContext, useState, ReactNode } from "react";
import { PlayerType } from "../Types/players";

export enum Categories {
    POINTS_PER_GAME = "Points Per Game",
    ASSISTS_PER_GAME = "Assists Per Game",
    REBOUNDS_PER_GAME = "Rebounds Per Game",
    GAMES_PLAYED = "Games Played",
    NONE = "",
}

export type AttemptsType = 0 | 1 | 2;

interface GameContextType {
    players: PlayerType[];
    setPlayers: (players: PlayerType[]) => void;
    category: Categories;
    setCategory: (category: Categories) => void;
    attempts: AttemptsType;
    setAttempts: (attempts: AttemptsType) => void;
    lastAttempt: PlayerType[] | null;
    setLastAttempt: (lastAttempt: PlayerType[] | null) => void;
    resetToLastAttempt: () => void;
    lastAttemptCorrect: number | null;
    setLastAttemptCorrect: (lastAttemptCorrect: number | null) => void; 
}


const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: {children: ReactNode }) => {

    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [category, setCategory] = useState<Categories>(Categories.NONE);
    const [attempts, setAttempts] = useState<AttemptsType>(0);
    const [lastAttempt, setLastAttempt] = useState<PlayerType[] | null>(null);
    const [lastAttemptCorrect, setLastAttemptCorrect] = useState<number | null>(null);

    const resetToLastAttempt = () => {
        if (lastAttempt) setPlayers(lastAttempt);
    }

    return (
        <GameContext.Provider
        value={{
            players, 
            setPlayers,
            attempts,
            setAttempts,
            category,
            setCategory,
            lastAttempt, 
            setLastAttempt,
            resetToLastAttempt,
            lastAttemptCorrect,
            setLastAttemptCorrect
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