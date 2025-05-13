import { apiClient } from './axiosClient';

interface SessionResponse {
  players: any[];
  solution: any;
}


type UserStatsInterface = {
    games_played: number;
    attempts_per_win_distro: number[];
    games_won: number;
    curr_streak: number;
    longest_streak: number;
};

type UserInterface = UserStatsInterface & {
    user_id: string;
};


export const createSession = async (userId: string): Promise<SessionResponse> => {
  try {
    const { data } = await apiClient.post<SessionResponse>('/sessions', { user_id: userId });
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
    const { data } = await apiClient.post<UserInterface>('/user', {});
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
