import { Navigate } from "react-router-dom";
import { PropsWithChildren } from "react";
import { isLoggedIn } from "../../utils/auth.utils";

const GuardRoute = ({ scope, children }: PropsWithChildren & { scope: "INNER" | "OUTER" | "QUESTIONS" }) => {
    const userLogged = isLoggedIn();

    if (scope === "INNER" && !userLogged) {
        return <Navigate to="/" />;
    }

    if (scope === "OUTER" && userLogged) {
        return <Navigate to="/app/home" />;
    }

    return children;
};

export default GuardRoute;
