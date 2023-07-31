import jwtDecoded from "jwt-decode";
import { get } from "lodash";
import { USER_ROLE } from "./consts.utils";

interface tokenDecoded {
    session: string;
    userRole: USER_ROLE;
}

export const getUserRole = () => {
    const accessToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    if (!accessToken) {
        return "Pesquisador";
    }

    const decoded = jwtDecoded<tokenDecoded>(accessToken);

    return get(decoded, "userRole", "Pesquisador");
};

export const isLoggedIn = (): boolean => {
    const accessToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    if (accessToken) {
        return true;
    }
    return false;
};
