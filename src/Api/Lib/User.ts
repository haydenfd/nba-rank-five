import { CreateNewUserResponseInterface } from "../../Types/api";
import { StatsModalStateInterface } from "../../Types/modals";
import { apiClient } from "../axiosClient";
import { AxiosResponse } from "axios";

const createNewUser = async ():Promise<CreateNewUserResponseInterface> => {
  try {
    const response:AxiosResponse<CreateNewUserResponseInterface> = await apiClient.post("/users/create", {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchUserStats = async (userId: string | null):Promise<StatsModalStateInterface> => {
  try {
    const response: AxiosResponse<StatsModalStateInterface> = await apiClient.get(`/users/stats/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { createNewUser, fetchUserStats };
