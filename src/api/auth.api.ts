import axios from "axios";
import { Tokens, clearTokens, setAuthHeaders } from "../utils/tokensHandler";
import { LoginValues } from "../schemas/loginSchema";
import { USER_ROLE } from "../utils/consts.utils";

export const registerResearcher = async (data: FormData) => {
    return axios.post<Tokens>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/register`, data, {
        method: "POST",
    });
};

export const loginResearcher = async (data: LoginValues) => {
    return axios.post<Tokens>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/login`, data, {
        method: "POST",
    });
};

export const fetchUserRole = async (userId: string) => {
    setAuthHeaders();
    return axios.get<USER_ROLE>(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/userRole/${userId}`);
};

export const setUserRole = async (userId: string, newRole: string, emailMessage: string | undefined) => {
    setAuthHeaders();
    return axios.patch(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/setUserRole`, { userId, newRole, emailMessage });
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
