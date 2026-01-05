import axios from "axios";

export const BASE_URL = "https://quickstay-backend-y009.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export default api;
