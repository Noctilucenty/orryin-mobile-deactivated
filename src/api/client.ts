import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / timeout errors
    if (!error.response) {
      return Promise.resolve({
        data: {
          warning: "Network error or timeout",
        },
      });
    }

    // Known backend responses should never crash the UI
    const { status, data } = error.response;

    // Treat common MVP errors as safe responses
    if (status === 409 || status === 400 || status === 422) {
      return Promise.resolve({ data });
    }

    // Fallback safe response
    return Promise.resolve({
      data: {
        error: "Unexpected backend error",
        details: data,
      },
    });
  }
);
