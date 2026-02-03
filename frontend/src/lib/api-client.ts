import axios from "axios";
import { API_BASE_URL } from "./constants";

/**
 * Shared axios instance for all API calls.
 * Configured with base URL and default settings.
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

/**
 * Request interceptor for adding auth headers, logging, etc.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Add any request modifications here (e.g., auth tokens)
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for handling errors globally.
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common error cases (401, 403, 500, etc.)
        if (error.response?.status === 401) {
            // Could redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);
