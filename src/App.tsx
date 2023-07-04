import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import InnerNavBar from "./components/Inner/InnerNavBar/InnerNavBar";
import OuterNavBar from "./components/Outer/OuterNavBar/OuterNavBar";
import GuardRoute from "./components/GuardRoute/GuardRoute";

function OuterLayout() {
    return (
        <div className="relative h-full overflow-auto bg-slate-950 bg-opacity-50 bg-[url('src/assets/background.png')] bg-cover bg-no-repeat bg-blend-multiply">
            <OuterNavBar />
            <GuardRoute scope="OUTER">
                <Outlet />
            </GuardRoute>
        </div>
    );
}

function InnerLayout() {
    return (
        <div className="bg-white">
            <InnerNavBar />
            <GuardRoute scope="INNER">
                <Outlet />
            </GuardRoute>
        </div>
    );
}

function LoginPageTemp() {
    return <p>Login Page</p>;
}

function HomePageTemp() {
    return <p>Login Page</p>;
}

const router = createBrowserRouter([
    {
        path: "/",
        Component: OuterLayout,
        children: [
            { index: true, Component: LoginPageTemp },
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
