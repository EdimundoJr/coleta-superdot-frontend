import axios from "axios";

export const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAuthHeaders();
};

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthHeaders();
};

export const setAuthHeaders = () => {
    axios.interceptors.request.use((request) => {
        request.headers.set("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
        request.headers.set("X-Refresh", localStorage.getItem("refreshToken"));

        return request;
    });
};
