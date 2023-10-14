import axios, { AxiosHeaders } from "axios";
import jwtDecoded, { JwtPayload } from "jwt-decode";
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
};

export const setAuthHeaders = () => {
    axios.interceptors.request.use((request) => {
        const token =
            localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY) ??
            localStorage.getItem(import.meta.env.VITE_PARTICIPANT_TOKEN_KEY);
        request.headers.set("Authorization", `Bearer ${token}`);
        request.headers.set("X-Refresh", localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY));

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
    if (!participantToken) return;
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
        throw new Error("Token not found!");
    }

    const tokenDecoded = jwtDecoded<ParticipantToken & JwtPayload>(token);

    if (tokenDecoded.exp && DateTime.now().toSeconds() > tokenDecoded.exp) {
        console.log(tokenDecoded.exp);
        console.log(DateTime.now().toSeconds());
        throw new Error("Token expired!");
    }

    if (!tokenDecoded.participantEmail) {
        throw new Error("Invalid token!");
    }

    return tokenDecoded;
};

export const hasActiveSession = () => {
    const accessToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);

    if (!accessToken) {
        return false;
    }

    const tokenDecoded = jwtDecoded<JwtPayload>(accessToken);

    if (tokenDecoded.exp && DateTime.now().toSeconds() > tokenDecoded.exp) {
        const refreshToken = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY);
        if (!refreshToken) return false;

        const refreshTokenDecoded = jwtDecoded<JwtPayload>(refreshToken);

        if (refreshTokenDecoded.exp && DateTime.now().toSeconds() > refreshTokenDecoded.exp) return false;
    }

    return true;
};
