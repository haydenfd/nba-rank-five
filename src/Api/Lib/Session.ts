import { AttemptsType, PlayerDataInterface } from "../../Types/store";
import { apiClient } from "../axiosClient";
import { AxiosResponse } from "axios";
import { FetchSessionResponseInterface, CreateNewSessionResponseInterface } from "../../Types/api";

const fetchSession = async (user_id: string, session_id: string):Promise<FetchSessionResponseInterface> => {
  try {
    const response:AxiosResponse<FetchSessionResponseInterface> = await apiClient.get(`/session/retrieve/${user_id}/${session_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createSession = async (user_id: string | null):Promise<CreateNewSessionResponseInterface> => {
  try {
    const response:AxiosResponse<CreateNewSessionResponseInterface> = await apiClient.post("/session/create/", {
      user_id: user_id,
    });

    return response.data;

  } catch (error) {
    throw error;
  }
};

/* This is very very messy. Fix */
const evaluateAttempt = async (user_id: string | null, session_id: string | null, guesses: PlayerDataInterface[], attempts: AttemptsType) => {
  try {
    const response = await apiClient.put("/session/evaluate", {
      user_id: user_id,
      session_id: session_id,
      guesses: guesses,
      attempts: attempts,
    });

    const scores_array = response.data;
    return scores_array;
  } catch (error) {
    throw error;
  }
};

export { fetchSession, createSession, evaluateAttempt };
