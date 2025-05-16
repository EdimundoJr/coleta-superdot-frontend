import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth.utils";

interface GuardRouteProps {
    children: React.ReactNode;
    scope: "INNER" | "OUTER";
    publicRoute?: boolean;
}

export const GuardRoute = ({
    children,
    scope,
    publicRoute = false
}: GuardRouteProps) => {
    const userLogged = isLoggedIn();
    const location = useLocation();

    // Rotas públicas
    if (publicRoute) {
        if (userLogged && location.pathname === "/") {
            return <Navigate to="/app/home" replace />;
        }
        return <>{children}</>;
    }

    // Rotas privadas
    if (!userLogged && scope === "INNER") {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (userLogged && scope === "OUTER") {
        return <Navigate to="/app/home" replace />;
    }
    if (location.pathname.startsWith('/formulario-adulto')) {
        return <>{children}</>;
    }

    return <>{children}</>;
};