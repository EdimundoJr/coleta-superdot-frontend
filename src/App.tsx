import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import GuardRoute from "./components/GuardRoute/GuardRoute";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import UsersPage from "./pages/UsersPage/UsersPage";
import CreateSamplePage from "./pages/CreateSamplePage/CreateSamplePage";
import ChooseSampleGroupPage from "./pages/ChooseSampleGroupPage/ChooseSampleGroupPage";
import SampleReviewPage from "./pages/SampleReviewPage/SampleReviewPage";
import SideBar from "./components/SideBar/SideBar";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import { getUserRole } from "./utils/auth.utils";
import MySamplesPage from "./pages/MySamplesPage/MySamplesPage";
import EditSamplePage from "./pages/EditSamplePage/EditSamplePage";
import DashBoardPage from "./pages/DashboardPage/DashboardPage";
import ParticipantsRegistration from "./pages/ParticipantsRegistration/ParticipantsRegistration";
import AdultForm from "./pages/AdultForm/AdultForm";
import AdultFormSecondSourcePage from "./pages/AdultFormSecondSourcePage/AdultFormSecondSourcePage";
import { clearTokens, hasActiveSession } from "./utils/tokensHandler";
import AnalysisPage from "./pages/AnalysisPage/AnalysisPage";

function OuterLayout() {
    return (
        <div className="relative h-full overflow-auto">
            <GuardRoute scope="OUTER">
                <Outlet />
            </GuardRoute>
        </div>
    );
}

function InnerLayout() {
    const userRole = getUserRole();
    const navigate = useNavigate();
    if (!hasActiveSession()) {
        clearTokens();
        navigate("/");
    }
    return (
        <div className="flex bg-white text-primary-text">
            <SideBar userRole={userRole} />
            <div className="w-full">
                <GuardRoute scope="INNER">
                    <Outlet />
                </GuardRoute>
            </div>
        </div>
    );
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
        path: "/formulario-adulto/:sampleId",
        Component: OuterLayout,
        children: [{ index: true, Component: AdultForm }],
    },
    {
        path: "/formulario-adulto/:sampleId/:participantId/:verificationCode",
        Component: OuterLayout,
        children: [{ index: true, Component: AdultForm }],
    },
    {
        path: "/formulario-adulto-segunda-fonte/:sampleId/:participantId",
        Component: OuterLayout,
        children: [{ index: true, Component: AdultFormSecondSourcePage }],
    },
    {
        path: "/formulario-adulto-segunda-fonte/:sampleId/:participantId/:secondSourceId/:verificationCode",
        Component: OuterLayout,
        children: [{ index: true, Component: AdultFormSecondSourcePage }],
    },
    {
        path: "app",
        Component: InnerLayout,
        children: [
            {
                path: "home",
                Component: DashBoardPage,
            },
            {
                path: "choose-sample-group",
                Component: ChooseSampleGroupPage,
            },
            {
                path: "my-samples",
                Component: MySamplesPage,
            },
            {
                path: "create-sample",
                Component: CreateSamplePage,
            },
            {
                path: "edit-sample",
                Component: EditSamplePage,
            },
            {
                path: "participants-registration",
                Component: ParticipantsRegistration,
            },
            {
                path: "analisar-amostra",
                Component: AnalysisPage,
            },
            {
                path: "users",
                Component: UsersPage,
            },
            {
                path: "review-requests",
                Component: SampleReviewPage,
            },
            {
                path: "logout",
                Component: LogoutPage,
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
