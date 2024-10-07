import { apiClient } from "../axiosClient";

const createNewUser = async () => {

    try {
        const response = await apiClient.post('/users/create', {});
        const newUser = response.data;
        return newUser;
        
    } catch (error) {
        throw error;
    }
};

export {
    createNewUser,
};
