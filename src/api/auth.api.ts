import axios from "axios";
import { Tokens, clearTokens, setAuthHeaders } from "../utils/tokensHandler";

export const registerResearcher = async (data: FormData) => {
    return axios.post<Tokens>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/register`, data, {
        method: "POST",
    });
};

export const logoutUser = async () => {
    clearTokens();
};

interface IsValidSessionResponse {
    valid: boolean;
}

export const isValidSession = async () => {
    setAuthHeaders();
    return axios.get<IsValidSessionResponse>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/isValidSession`);
};
