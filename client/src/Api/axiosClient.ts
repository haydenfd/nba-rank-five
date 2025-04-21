import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  httpsAgent: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
