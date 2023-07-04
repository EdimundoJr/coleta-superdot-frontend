import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";

interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
}

export const registerResearcher = async (data: FormData) => {
    return axios.post<RegisterResponse>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/register`, data, {
        method: "POST",
    });
};

interface IsValidSessionResponse {
    valid: boolean;
}

export const isValidSession = async () => {
    setAuthHeaders();
    return axios.get<IsValidSessionResponse>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/isValidSession`);
};
