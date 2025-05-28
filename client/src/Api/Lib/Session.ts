import { PlayerType } from "../../Types/players";
import { apiClient } from "../axiosClient";
import { AxiosResponse } from "axios";
import { FetchSessionResponseInterface, CreateNewSessionResponseInterface, EvaluateSessionAttemptInterface } from "../../Types/api";

type AttemptsType = 0 | 1 | 2;
const fetchSession = async (user_id: string, session_id: string): Promise<FetchSessionResponseInterface> => {
  try {
    const response: AxiosResponse<FetchSessionResponseInterface> = await apiClient.get(`/session/retrieve/${user_id}/${session_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createSession = async (user_id: string | null): Promise<CreateNewSessionResponseInterface> => {
  try {
    const response: AxiosResponse<CreateNewSessionResponseInterface> = await apiClient.post("/session/create/", {
      user_id: user_id,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const evaluateAttempt = async (
  user_id: string | null,
  session_id: string | null,
  guesses: PlayerType[],
  attempts: AttemptsType,
): Promise<EvaluateSessionAttemptInterface> => {
  try {
    const response: AxiosResponse<EvaluateSessionAttemptInterface> = await apiClient.post("/session/evaluate", {
      user_id: user_id,
      session_id: session_id,
      guesses: guesses,
      attempts: attempts,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { fetchSession, createSession, evaluateAttempt };
