import { AttemptsType, PlayerDataInterface } from "../../Types/store";
import { apiClient } from "../axiosClient";

const fetchSession = async (
  user_id: string | null,
  session_id: string | null,
) => {
  try {
    const response = await apiClient.get(
      `/session/retrieve/${user_id}/${session_id}`,
    );

    const session = response.data;
    return session;
  } catch (error) {
    console.error("Failed to fetch session data:", error);
    throw error;
  }
};

const initializeNewSession = async (user_id: string | null) => {
  try {
    const response = await apiClient.post("/session/create/", {
      user_id: user_id,
    });

    console.log('Session')
    const session = response.data;
    return session;
  } catch (error) {
    throw error;
  }
};

const evaluateAttempt = async (
  user_id: string | null,
  session_id: string | null,
  guesses: PlayerDataInterface[],
  attempts: AttemptsType,
) => {
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

export { fetchSession, initializeNewSession, evaluateAttempt };
