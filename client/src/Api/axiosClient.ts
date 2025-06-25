import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://nkc0fg59d8.execute-api.us-west-1.amazonaws.com/dev",
  headers: {
    "Content-Type": "application/json",
  },
});
