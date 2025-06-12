import { CategoryType } from '../Context/GameContext';
import { apiClient } from './axiosClient';
import { PlayerListType } from './Types';

type PlayerType = {
  PLAYER_ID: number;
  PLAYER_NAME: string;
  CODE: string;
  PPG?: number;
  APG?: number;
  RPG?: number;
  GP?: number;
}

export interface _UserInterface {
  games_played: number;
  attempts_per_win_distro: [number, number, number];
  games_won: number;
  curr_streak: number;
  longest_streak: number;
  user_id: string;
}

export interface _SessionInterface {
  user_id: string;
  session_id: string;
  attempts: 0 | 1 | 2 | 3;
  category: "APG" | "PPG" | "RPG" | "GP";
  lastGuessesAttempt: [] | [number, number, number, number, number];
  lastGuessesCorrect: null | number;
  players: PlayerType[];
}

interface SessionResponse {
  players: any[];
  solution: any;
}

interface FetchSessionResponse {
  players: PlayerType[];
  category: CategoryType;

}

type UserStatsInterface = {
    games_played: number;
    attempts_per_win_distro: [number, number, number];
    games_won: number;
    curr_streak: number;
    longest_streak: number;
};

type UserInterface = UserStatsInterface & {
    user_id: string;
};


export const createSession = async (userId: string): Promise<_SessionInterface> => {
  try {
    const { data } = await apiClient.post<_SessionInterface>('/create-session', { user_id: userId });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

/**
 * Fetches a user and user stats given a user_id
 * @returns userInterface
 */

export const createUser = async (): Promise<UserInterface> => {
  try {
    const { data } = await apiClient.post<_UserInterface>('/create-user', {});
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}; 


export const fetchUser = async (user_id: string): Promise<UserInterface> => {
    try {
        const { data } = await apiClient.post<UserInterface>('/fetch-user', {
            user_id
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;    
    }
}

export const fetchSession = async (user_id: string): Promise<_SessionInterface> => {
    try {
        const { data } = await apiClient.post<_SessionInterface>('/fetch-session', {
            user_id
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('fetched session');
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;    
    }
}

export const makeGuess = async (guesses: string[], user_id: string, attempts: number) => {
  try {
    const { data } = await apiClient.post<any>('/guess', {
      guesses,
      user_id,
      attempts,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error making guess: ", error);
  }
};