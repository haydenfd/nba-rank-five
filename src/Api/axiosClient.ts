import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://localhost:8080",
  httpsAgent: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
