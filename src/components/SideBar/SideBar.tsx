import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { USER_ROLE } from "../../utils/consts.utils";
import * as Icon from "@phosphor-icons/react"
import { useEffect, useState } from "react";
import { getUser, Users } from "../../api/researchers.api";
import UserInfo from "../UserInfo/UserInfo";
import { Box, Flex } from "@radix-ui/themes";
import { useMenu } from "../UseMenu/UseMenu ";
import React from "react";

interface SideBarProps {
    userRole?: USER_ROLE;
}

const SideBar = ({ userRole }: SideBarProps) => {
    const [expanded, setExpanded] = useState(false);
    const [userData, setUserData] = useState<null | Users>(null);
    const [error, setError] = useState<Error | null>(null);
    const { isMobileMenuOpen, toggleMobileMenu } = useMenu();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUser();
                setUserData(data);
            } catch (error: any) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    const location = useLocation();

    const isActive = (...pathNames: string[]) => {
        return pathNames.includes(location.pathname)
            ? `truncate text-white rounded flex items-center overerflow-hidden 
             transition-all duration-300 ease-in-out bg-glass-no-border   
             ${expanded ? "w-[200px] " : "w-[full]  max-xl:w-full"} 
           `
            : "";
    };

    function isActiveIcon(...pathNames: string[]) {
        return pathNames.includes(location.pathname) ? "bold" : "thin";
    }

    const Menus = [
        { title: "Dashboard", icon: <Icon.SquaresFour weight={`${isActiveIcon("/app/home")}`} size={24} />, link: "/app/home", active: `${isActive("/app/home")}` },
        { title: "Minhas Amostras", icon: <Icon.Books weight={`${isActiveIcon("/app/my-samples", "/app/my-samples/analyze-sample", "/app/my-samples/participants-registration", "/app/my-samples/seconds-source-compare", "/app/my-samples/evaluate-autobiography", "/app/my-samples/compare-participants-selected", "/app/edit-sample")}`} size={24} />, link: "/app/my-samples", active: `${isActive("/app/my-samples", "/app/my-samples/analyze-sample", "/app/my-samples/seconds-source-compare", "/app/my-samples/participants-registration", "/app/my-samples/evaluate-autobiography", "/app/my-samples/compare-participants-selected", "/app/edit-sample")}` },
        { title: "Criar Amostras", icon: <Icon.FolderSimplePlus weight={`${isActiveIcon("/app/create-sample", "/app/choose-sample-group")}`} size={24} />, link: "/app/create-sample", active: `${isActive("/app/choose-sample-group", "/app/create-sample")}` },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`fixed desktop top-0 left-0 h-screen z-50 bg-primary shadow-md transition-all duration-300 ease-in-out ${expanded ? "w-64" : "w-20"} overflow-hidden`}>
                <div className={`flex items-center p-4 overflow-hidden transition-all duration-500 ${expanded ? "max-w-[200px]" : "max-w-[60px]"}`}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="relative z-50 text-white group transition-all duration-300 hover:scale-[1.15]"
                    >
                        <div className="relative w-6 h-6 ml-2 mt-2">
                            {/* Ícone X */}
                            <Icon.X
                                size={24}
                                className={`absolute transition-all duration-300 origin-center ${expanded
                                    ? 'opacity-100 rotate-180 scale-100'
                                    : 'opacity-0 -rotate-90 scale-50'
                                    }`}
                            />

                            {/* Ícone Hambúrguer */}
                            <Icon.List
                                size={24}
                                className={`absolute transition-all duration-300 origin-center ${expanded
                                    ? 'opacity-0 rotate-90 scale-50'
                                    : 'opacity-100 rotate-0 scale-100'
                                    }`}
                            />
                        </div>
                    </button>

                    <h1 className={`ml-4 text-xl font-bold text-white transition-all duration-300 ${expanded
                        ? "opacity-100 translate-x-0 scale-100 delay-150"
                        : "opacity-0 -translate-x-4 scale-0 absolute"
                        } mt-2`}>
                        SUPERDOT
                    </h1>
                </div>
                <nav className="flex flex-col space-y-4 px-2 mt-2">
                    {userRole?.match(/Pesquisador|Revisor|Administrador/) && Menus.map((menu, idx) => (
                        <Link
                            key={idx}
                            to={menu.link}
                            className={`group flex truncate items-center ${expanded ? "!justify-start" : "justify-center"} gap-4 p-3 rounded-md transition-all duration-300 hover:bg-secondary text-white ${isActive(menu.link) ? "bg-secondary" : ""
                                } ${expanded ? "pl-4" : "pl-3"}`}
                        >
                            <div className="min-w-[24px] flex justify-center">
                                {React.cloneElement(menu.icon, {
                                    className: `transition-transform duration-300 ${expanded ? "translate-x-0" : "translate-x-1"}`
                                })}
                            </div>
                            <span className={`origin-left font-medium transition-[opacity,transform] duration-300 ${expanded
                                ? "opacity-100 translate-x-0 max-w-[300px] delay-150"
                                : "opacity-0 translate-x-4 max-w-0 pointer-events-none"
                                }`}>
                                {menu.title}
                            </span>
                        </Link>
                    ))}

                    {/* Links para Revisor/Administrador */}
                    {userRole?.match(/Revisor|Administrador/) && (
                        <Link
                            to="/app/review-requests"
                            className={`group flex items-center ${expanded ? "!justify-start" : "justify-center"} truncate gap-4 p-3 rounded-md transition-all duration-300 hover:bg-secondary text-white ${isActive("/app/review-requests") ? "bg-secondary" : ""
                                } ${expanded ? "pl-4" : "pl-3"}`}
                        >
                            <Icon.Check size={24} className={`transition-transform duration-300 ${expanded ? "translate-x-0" : "translate-x-1"}`} weight={`${isActiveIcon("/app/review-requests")}`} />
                            <span className={`origin-left font-medium transition-[opacity,transform] duration-300 ${expanded
                                ? "opacity-100 translate-x-0 max-w-[200px] delay-200"
                                : "opacity-0 translate-x-4 max-w-0 pointer-events-none"
                                }`}>
                                Revisar Solicitações
                            </span>
                        </Link>
                    )}

                    {/* Link para Administrador */}
                    {userRole === "Administrador" && (
                        <Link
                            to="/app/users"
                            className={`group flex items-center truncate ${expanded ? "!justify-start" : "justify-center"} gap-4 p-3 rounded-md transition-all duration-300 hover:bg-secondary text-white ${isActive("/app/users") ? "bg-secondary" : ""
                                } ${expanded ? "pl-4" : "pl-3"}`}
                        >
                            <Icon.UserGear size={24} className={`transition-transform duration-300 ${expanded ? "translate-x-0" : "translate-x-1"}`} weight={`${isActiveIcon("/app/users")}`} />
                            <span className={`origin-left font-medium transition-[opacity,transform] duration-300 ${expanded
                                ? "opacity-100 translate-x-0 max-w-[200px] delay-300"
                                : "opacity-0 translate-x-4 max-w-0 pointer-events-none"
                                }`}>
                                Usuários
                            </span>
                        </Link>
                    )}
                </nav>
            </aside>


            {/* Mobile Menu */}
            < div className="fixed top-0 right-0 w-full bg-primary z-50 px-2 flex justify-between items-center xl:hidden" >
                <h2 className="text-2xl  font-bold text-white">SUPERDOT</h2>
                <button onClick={toggleMobileMenu} className="text-white z-50">
                    {isMobileMenuOpen ? <Icon.X size={24} /> : <Icon.List size={24} />}
                </button>
            </div >

            <div className={`fixed truncate top-0 right-0 h-full w-[60%] bg-primary z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-2 mt-12 space-y-4">
                    {userRole?.match(/Pesquisador|Revisor|Administrador/) && Menus.map((menu, idx) => (
                        <Link
                            key={idx}
                            to={menu.link}
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-4 p-3 rounded-md text-white hover:bg-secondary ${isActive(menu.link) ? "bg-secondary" : ""}`}
                        >
                            {menu.icon}
                            <span>{menu.title}</span>
                        </Link>
                    ))}

                    {userRole?.match(/Revisor|Administrador/) && (
                        <Link
                            to="/app/review-requests"
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-2 p-2 rounded-md text-white hover:bg-secondary ${isActive("/app/review-requests") ? "bg-secondary" : ""}`}
                        >
                            <Icon.Check size={24} />
                            <span>Revisar solicitações</span>
                        </Link>
                    )}

                    {userRole === "Administrador" && (
                        <Link
                            to="/app/users"
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-4 p-3 rounded-md text-white hover:bg-secondary ${isActive("/app/users") ? "bg-secondary" : ""}`}
                        >
                            <Icon.UserGear size={24} />
                            <span>Usuários</span>
                        </Link>
                    )}
                </div>

                <Flex className="absolute bottom-0 w-full p-4 bg-secondary">
                    <UserInfo className="text-white" />
                </Flex>
            </div>
        </>
    );
};
export default SideBar;