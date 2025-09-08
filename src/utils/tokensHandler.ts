import axios, { AxiosHeaders } from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { DateTime } from "luxon";

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}



export const saveTokens = ({ accessToken, refreshToken }: Tokens) => {
    localStorage.removeItem(import.meta.env.VITE_PARTICIPANT_TOKEN_KEY);
    localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY, refreshToken);
    setAuthHeaders();
};

export const clearTokens = () => {
    localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY);
    localStorage.removeItem(import.meta.env.VITE_PARTICIPANT_TOKEN_KEY);
};

let isInterceptorSet = false;

export const setAuthHeaders = () => {
    if (isInterceptorSet) {
        return;
    }
    isInterceptorSet = true;

    axios.interceptors.request.use((request) => {
        const token =
            localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY) ??
            localStorage.getItem(import.meta.env.VITE_PARTICIPANT_TOKEN_KEY);

        if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
        }

        const refreshToken = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY);

        if (refreshToken) {
            request.headers.set("X-Refresh", refreshToken);
        }

        return request;
    });

    axios.interceptors.response.use((response) => {
        if (response.headers instanceof AxiosHeaders) {
            const newAccessToken = response.headers["x-access-token"];

            if (typeof newAccessToken === "string") {
                localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_KEY, newAccessToken);
            }
        }
        return response;
    });
};

export const saveParticipantToken = (participantToken?: string) => {
    if (!participantToken) {
        return;
    }
    clearTokens();
    localStorage.setItem(import.meta.env.VITE_PARTICIPANT_TOKEN_KEY, participantToken);
    setAuthHeaders();
};

interface ParticipantToken {
    participantId?: string;
    participantEmail: string;
}

export const deserializeJWTParticipantToken = (): ParticipantToken => {
    const token = localStorage.getItem(import.meta.env.VITE_PARTICIPANT_TOKEN_KEY);

    if (!token) {
        throw new Error("Token não fornecido!");
    }

    try {
        const tokenDecoded = jwtDecode<ParticipantToken & JwtPayload>(token);

        if (tokenDecoded.exp && DateTime.now().toSeconds() > tokenDecoded.exp) {
            throw new Error("Token expirado!");
        }

        if (!tokenDecoded.participantEmail) {
            throw new Error("Token inválido!");
        }

        return tokenDecoded;
    } catch (error) {
        throw new Error("Erro ao decodificar o token!");
    }
};

export const hasActiveSession = () => {
    const accessToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) {
        console.warn("Access token ou refresh token não encontrados.");
        return false;
    }

    const accessTokenDecoded = jwtDecode<JwtPayload>(accessToken);
    const refreshTokenDecoded = jwtDecode<JwtPayload>(refreshToken);

    if (accessTokenDecoded.exp && DateTime.now().toSeconds() > accessTokenDecoded.exp) {
        console.warn("Access token expirado.");
        if (refreshTokenDecoded.exp && DateTime.now().toSeconds() > refreshTokenDecoded.exp) {
            console.warn("Refresh token expirado.");
            return false;
        }
        return true;
    }

    return true;
};