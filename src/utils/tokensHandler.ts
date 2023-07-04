import axios from "axios";

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export const saveTokens = ({ accessToken, refreshToken }: Tokens) => {
    localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY, refreshToken);
    setAuthHeaders();
};

export const clearTokens = () => {
    localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY);
    setAuthHeaders();
};

export const setAuthHeaders = () => {
    axios.interceptors.request.use((request) => {
        request.headers.set("Authorization", `Bearer ${localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)}`);
        request.headers.set("X-Refresh", localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY));

        return request;
    });
};

export const isLoggedIn = (): boolean => {
    const accessToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    if (accessToken) {
        return true;
    }
    return false;
};
