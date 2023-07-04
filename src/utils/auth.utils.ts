export const getUserRole = () => {
    return localStorage.getItem(import.meta.env.VITE_USER_ROLE_KEY);
};

export const isLoggedIn = (): boolean => {
    const accessToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    if (accessToken) {
        return true;
    }
    return false;
};
