import { CheckIcon, ExitIcon, FilePlusIcon, HomeIcon, PersonIcon, ReaderIcon, RowsIcon } from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Separator from "@radix-ui/react-separator";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { USER_ROLE } from "../../utils/consts.utils";

interface SideBarProps {
    userRole: USER_ROLE;
}

const SideBar = ({ userRole }: SideBarProps) => {
    const [expanded, setExpanded] = useState(false);

    const location = useLocation();
    function isActive(pathName: string) {
        return location.pathname === pathName ? "bg-secondary" : "";
    }

    return (
        <div className="sticky left-0 top-0 h-screen min-w-fit bg-gradient-to-b from-[#5300B8] to-[#7F35E1] font-semibold text-alternative-text ">
            <div className="flex w-full justify-center p-4">
                <div className="m-auto flex gap-10 text-xl font-bold">
                    {expanded && "GRUPAC"}
                    <RowsIcon onClick={() => setExpanded(!expanded)} className="my-auto cursor-pointer" />
                </div>
            </div>
            <Separator.Root className="h-px w-full bg-white" />
            <NavigationMenu.Root orientation="vertical">
                <NavigationMenu.List className="p-2">
                    <NavigationMenu.Item className={`flex items-center p-2 ${isActive("/app/home")}`}>
                        <Link to="/app/home" className="flex gap-3">
                            <HomeIcon className="m-auto" />
                            {expanded && "Dashboard"}
                        </Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item className={`flex items-center p-2 ${isActive("/app/my-samples")}`}>
                        <Link to="/app/my-samples" className="flex gap-3">
                            <ReaderIcon className="m-auto" />
                            {expanded && "Minhas Amostras"}
                        </Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item className={`flex items-center p-2 ${isActive("/app/create-sample")}`}>
                        <Link to="/app/create-sample" className="flex gap-3">
                            <FilePlusIcon className="m-auto" />
                            {expanded && "Criar Amostra"}
                        </Link>
                    </NavigationMenu.Item>
                    {userRole.match("Revisor|Administrador") && (
                        <>
                            <NavigationMenu.Item
                                className={`flex items-center p-2 ${isActive("/app/review-requests")}`}
                            >
                                <Link to="/app/review-requests" className="flex gap-3">
                                    <CheckIcon className="m-auto" />
                                    {expanded && "Revisar Solicitações"}
                                </Link>
                            </NavigationMenu.Item>
                        </>
                    )}
                    {userRole === "Administrador" && (
                        <>
                            <NavigationMenu.Item className={`flex items-center p-2 ${isActive("/app/users")}`}>
                                <Link to="/app/users" className="flex gap-3">
                                    <PersonIcon className="m-auto" />
                                    {expanded && "Usuários"}
                                </Link>
                            </NavigationMenu.Item>
                        </>
                    )}
                </NavigationMenu.List>
            </NavigationMenu.Root>
            <div className="absolute bottom-0 w-full">
                <Separator.Root className="h-px w-full bg-white" />
                <NavigationMenu.Root className="p-2">
                    <NavigationMenu.Item className={`flex items-center p-2 ${isActive("/app/my-profile")}`}>
                        <Link to="/app/my-profile" className="flex gap-3">
                            <PersonIcon className="m-auto" />
                            {expanded && "Perfil"}
                        </Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item className={`flex items-center p-2 ${isActive("/app/logout")}`}>
                        <Link to="/app/logout" className="flex gap-3">
                            <ExitIcon className="m-auto" />
                            {expanded && "Sair"}
                        </Link>
                    </NavigationMenu.Item>
                </NavigationMenu.Root>
            </div>
        </div>
    );
};

export default SideBar;
