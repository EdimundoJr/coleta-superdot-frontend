import { Navigate } from "react-router-dom";
import { isValidSession } from "../../api/auth.api";
import { PropsWithChildren, useEffect, useState } from "react";
import { clearTokens } from "../../utils/tokensHandler";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const [sessionValid, setSessionValid] = useState(false);

    useEffect(() => {
        const verifySession = () => {
            isValidSession().then(({ data }) => {
                setSessionValid(data.valid);
            });
        };
        verifySession();
    }, []);

    if (!sessionValid) {
        clearTokens();
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
