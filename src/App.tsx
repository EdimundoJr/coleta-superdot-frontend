import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
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
import AnalysisPage from "./pages/AnalysisPage/AnalysisPage";
import SecondsSourceCompare from "./pages/SecondsSourceCompare/SecondsSourceCompare";
import CompareParticipantsSelected from "./pages/CompareParticipantsSelected/CompareParticipantsSelected";
import EvaluateAutobiography from "./pages/EvaluateAutobiography/EvaluateAutobiography";
import { Flex } from "@radix-ui/themes";
import GuardRoute from "./components/GuardRoute/GuardRoute";

function OuterLayout() {
    return (
        <Flex className="overflow-hidden h-full w-full font-roboto bg-off-white">
            <GuardRoute scope="OUTER">
                <Outlet />
            </GuardRoute>
        </Flex>
    );
}

function InnerLayout() {
    const userRole = getUserRole();


    return (
        <Flex className="bg-primary font-roboto">
            <SideBar userRole={userRole} />
            <Flex direction="column" className={`relative border-t-4 border-primary rounded-tl-[30px] w-full bg-off-white p-5`}>
                <GuardRoute scope="INNER">
                    <Outlet />
                </GuardRoute>
            </Flex>
        </Flex>

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
                path: "my-samples/participants-registration",
                Component: ParticipantsRegistration,
            },
            {
                path: "my-samples/analyze-sample",
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
            {
                path: "my-samples/seconds-source-compare",
                Component: SecondsSourceCompare,
            },
            {
                path: "my-samples/compare-participants-selected",
                Component: CompareParticipantsSelected,
            },
            {
                path: "my-samples/evaluate-autobiography",
                Component: EvaluateAutobiography,
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
