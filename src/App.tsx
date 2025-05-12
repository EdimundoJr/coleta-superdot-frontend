import { Navigate, Outlet, RouterProvider, createBrowserRouter, useLocation } from "react-router-dom";
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
import { Box, Flex } from "@radix-ui/themes";
import { GuardRoute } from "./components/GuardRoute/GuardRoute";
import { Header } from "./components/Header/Header";
import * as Icon from "@phosphor-icons/react";
import { MenuProvider, useMenu } from "./components/UseMenu/UseMenu ";
import BackToTop from "./components/BackToTop/BackToTop";
import { PageContainer } from "./components/PageContainer/PageContainer";



function OuterLayout() {
    return (
        <Flex className="h-full w-full font-roboto bg-off-white">
            <GuardRoute scope="OUTER" publicRoute={true}>
                <Outlet />
            </GuardRoute>
        </Flex>
    );
}

function InnerLayout() {
    const userRole = getUserRole();
    const location = useLocation();
    const { isMobileMenuOpen, toggleMobileMenu } = useMenu();


    const headerConfig: Record<string, { title: string; icon: JSX.Element }> = {
        "home": { title: "Dashboard", icon: <Icon.SquaresFour size={20} /> },
        "choose-sample-group": { title: "Escolher Grupo de Amostras", icon: <Icon.Binoculars size={20} /> },
        "my-samples": { title: "Minhas Amostras", icon: <Icon.Books size={20} /> },
        "create-sample": { title: "Criar Amostra", icon: <Icon.FolderSimplePlus size={20} /> },
        "edit-sample": { title: "Editar Amostra", icon: <Icon.PencilSimple size={20} /> },
        "my-samples/participants-registration": { title: "Cadastro de Participantes", icon: <Icon.UserPlus size={20} /> },
        "my-samples/analyze-sample": { title: "Análise da Amostra", icon: <Icon.MagnifyingGlass size={20} /> },
        "users": { title: "Usuários", icon: <Icon.UsersThree size={20} /> },
        "review-requests": { title: "Revisar Solicitações", icon: <Icon.CheckCircle size={20} /> },
        "logout": { title: "Sair", icon: <Icon.SignOut size={20} /> },
        "my-samples/seconds-source-compare": { title: "Comparar Segunda Fonte", icon: <Icon.UsersFour size={20} /> },
        "my-samples/compare-participants-selected": { title: "Comparar Participantes", icon: <Icon.UsersFour size={20} /> },
        "my-samples/evaluate-autobiography": { title: "Avaliar Autobiografia", icon: <Icon.BookOpen size={20} /> },
    } as const;

    const currentPath = location.pathname.replace(/^\/app\//, "");
    const { title, icon } = headerConfig[currentPath] || {
        title: "Página não encontrada",
        icon: <Icon.WarningCircle size={24} />
    };

    return (

        <Flex className="bg-background font-roboto min-h-screen w-full">
            <Box className={`max-xl:!w-0 ${isMobileMenuOpen ? 'w-64' : 'w-16'}`}>
                <SideBar userRole={userRole} />
            </Box>


            <Box className="flex-1 transition-all duration-300 w-full">
                <GuardRoute scope="INNER">
                    <Header
                        title={title}
                        icon={icon}
                        onMenuToggle={toggleMobileMenu}
                    />
                    <PageContainer>
                        <Outlet />
                    </PageContainer>
                </GuardRoute>
            </Box>
            <BackToTop />
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
            {
                path: "formulario-adulto/:sampleId/:participantId/:verificationCode",
                Component: AdultForm
            },
            {
                path: "formulario-adulto/:sampleId",
                Component: AdultForm
            },
            {
                path: "formulario-adulto-segunda-fonte/:sampleId/:participantId/:secondSourceId/:verificationCode",
                Component: AdultFormSecondSourcePage
            },
            {
                path: "formulario-adulto-segunda-fonte/:sampleId/:participantId",
                Component: AdultFormSecondSourcePage
            },
            {
                path: "app",
                Component: InnerLayout,
                children: [
                    { path: "home", Component: DashBoardPage },
                    { path: "choose-sample-group", Component: ChooseSampleGroupPage },
                    { path: "my-samples", Component: MySamplesPage },
                    { path: "create-sample", Component: CreateSamplePage },
                    { path: "edit-sample", Component: EditSamplePage },
                    {
                        path: "my-samples",
                        children: [
                            { path: "participants-registration", Component: ParticipantsRegistration },
                            { path: "analyze-sample", Component: AnalysisPage },
                            { path: "seconds-source-compare", Component: SecondsSourceCompare },
                            { path: "compare-participants-selected", Component: CompareParticipantsSelected },
                            { path: "evaluate-autobiography", Component: EvaluateAutobiography },
                        ]
                    },
                    { path: "users", Component: UsersPage },
                    { path: "review-requests", Component: SampleReviewPage },
                    { path: "logout", Component: LogoutPage },
                ],
            },
            {
                path: "*",
                element: <Navigate to="/" replace />
            }
        ],
    },
]);


export default function App() {
    return (
        <MenuProvider>
            <RouterProvider router={router} />
        </MenuProvider>
    );
}
