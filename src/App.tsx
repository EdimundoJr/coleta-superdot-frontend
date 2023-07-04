import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import InnerNavBar from "./components/Inner/InnerNavBar/InnerNavBar";
import OuterNavBar from "./components/Outer/OuterNavBar/OuterNavBar";
import GuardRoute from "./components/GuardRoute/GuardRoute";
import SideMenu from "./components/Inner/SideMenu/SideMenu";
import { getUserRole } from "./utils/auth.utils";
import { LoginPage } from "./pages/LoginPage/LoginPage";

function OuterLayout() {
    return (
        <div className="relative h-full overflow-auto bg-slate-950 bg-opacity-50 bg-[url('public/background.png')] bg-cover bg-no-repeat bg-blend-multiply">
            <OuterNavBar />
            <GuardRoute scope="OUTER">
                <Outlet />
            </GuardRoute>
        </div>
    );
}

function InnerLayout() {
    return (
        <div className="flex h-full bg-white">
            <SideMenu userRole={getUserRole() || ""} />
            <div className="w-full">
                <InnerNavBar />
                <GuardRoute scope="INNER">
                    <Outlet />
                </GuardRoute>
            </div>
        </div>
    );
}
function HomePageTemp() {
    return <p>Login Page</p>;
}

const router = createBrowserRouter([
    {
        path: "/",
        Component: OuterLayout,
        children: [
            { index: true, Component: LoginPage },
            { path: "register", Component: RegisterPage },
        ],
    },
    {
        path: "/app",
        Component: InnerLayout,
        children: [
            {
                path: "home",
                Component: HomePageTemp,
            },
        ],
    },
    {
        path: "/*",
        Component: OuterLayout,
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
