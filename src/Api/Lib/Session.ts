import { apiClient } from "../axiosClient";
// import { FetchSessionParams } from "../../Types/api";

const fetchSession = async (user_id : string | null, session_id: string | null) => {

    try {

        const response = await apiClient.get(`/session/retrieve/${user_id}/${session_id}`);
        
        const session = response.data;
        return session;

      } catch (error) {
        console.error("Failed to fetch session data:", error);
        throw error; 
      }
}

const initializeNewSession = async (user_id: string | null) => {

    try {

        const response = await apiClient.post('/session/create/', {
            user_id: user_id
        });

        const session = response.data;
        return session;

    } catch (error) {
        throw error;
    }
}

export {
    fetchSession,
    initializeNewSession,
};
