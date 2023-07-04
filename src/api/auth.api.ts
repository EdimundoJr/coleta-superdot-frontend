import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { LoginValues } from "../schemas/loginSchema";

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export const registerResearcher = async (data: FormData) => {
    return axios.post<AuthResponse>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/register`, data, {
        method: "POST",
    });
};

export const loginResearcher = async (data: LoginValues) => {
    return axios.post<AuthResponse>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/login`, data, {
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
