import { Link, useLocation } from "react-router-dom";
import { USER_ROLE } from "../../utils/consts.utils";
import * as Icon from "@phosphor-icons/react"
import { useEffect, useState } from "react";
import { getUser, Users } from "../../api/researchers.api";
import UserInfo from "../UserInfo/UserInfo";
import { Flex } from "@radix-ui/themes";
import { useMenu } from "../UseMenu/UseMenu ";
import React from "react";

interface SideBarProps {
    userRole?: USER_ROLE;
}

const SideBar = ({ userRole }: SideBarProps) => {
    const [expanded, setExpanded] = useState(false);
    const [userData, setUserData] = useState<null | Users>(null);
    const [error, setError] = useState<Error | null>(null);
    const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMenu();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobileMenuOpen, closeMobileMenu]);

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
            <aside className={`fixed desktop top-0 left-0 h-screen z-50 bg-gradient-to-b from-violet-500 to-primary shadow-md transition-all duration-300 ease-in-out ${expanded ? "w-64" : "w-20"} overflow-hidden`}>
                {/* Elementos decorativos de fundo */}
                <div className="absolute  flex items-center justify-center overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full -top-48 -left-48 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full -bottom-48 -right-48 animate-pulse delay-300"></div>
                </div>

                <div className="relative z-10">
                    <div className={`flex items-center p-4 overflow-hidden transition-all duration-500 ${expanded ? "max-w-[200px]" : "max-w-[60px]"}`}>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="relative z-50 text-white group transition-all duration-300 hover:scale-[1.15]"
                        >
                            <div className="relative w-6 h-6 ml-3 mt-2">
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

                    <nav className="flex flex-col space-y-4 px-2 mt-2 ">
                        {userRole?.match(/Pesquisador|Revisor|Administrador/) && Menus.map((menu, idx) => (
                            <Link
                                key={idx}
                                to={menu.link}
                                onClick={() => setExpanded(false)}
                                className={`group flex truncate items-center ${expanded ? "!justify-start pl-4 gap-4" : "justify-center pl-3 gap-3"}  p-3 rounded-md transition-all duration-300 hover:bg-white/20 text-white  ${isActive(menu.link) ? "bg-white/20 shadow-lg backdrop-blur-sm" : ""}`}
                            >
                                <div className=" flex justify-center w-[24px]">
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
                                onClick={() => setExpanded(false)}
                                className={`group flex items-center ${expanded ? "!justify-start pl-4 gap-4" : "justify-center pl-3 gap-3"} truncate  p-3 rounded-md transition-all duration-300  text-white ${isActive("/app/review-requests") ? "bg-white/30 shadow-lg" : ""} `}
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
                                onClick={() => setExpanded(false)}
                                className={`group flex items-center truncate ${expanded ? "!justify-start pl-4 gap-4" : "justify-center pl-3 gap-3"} p-3 rounded-md transition-all duration-300  text-white  ${isActive("/app/users") ? "bg-white/20 backdrop-blur-lg" : ""} `}
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
                </div>
                {/* Elementos flutuantes */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute  left-28 w-24 h-24 bg-white/10 rounded-full animate-floatXY"></div>
                <div className="absolute bottom-16 left-12 w-8 h-8 bg-white/10 rounded-full animate-float-delayed"></div>
            </aside >


            {/* Mobile Menu */}
            <div className="fixed top-0 right-0 w-full bg-gradient-to-b from-violet-500 to-primary z-50 px-2 flex justify-between items-center xl:hidden">
                <h2 className="text-2xl  font-bold text-white">SUPERDOT</h2>
                <button onClick={toggleMobileMenu} className="text-white z-50">
                    {isMobileMenuOpen ? <Icon.X size={24} /> : <Icon.List size={24} />}
                </button>
            </div >

            <div className={`fixed truncate top-0 right-0 h-full w-[60%]  bg-primary z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="relative z-10 p-2 mt-12 space-y-4">
                    {userRole?.match(/Pesquisador|Revisor|Administrador/) && Menus.map((menu, idx) => (
                        <Link
                            key={idx}
                            to={menu.link}
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-4 p-3 rounded-md text-white btn-primary ${isActive(menu.link) ? "bg-white/20 backdrop-blur-lg" : ""}`}
                        >
                            {menu.icon}
                            <span>{menu.title}</span>
                        </Link>
                    ))}

                    {userRole?.match(/Revisor|Administrador/) && (
                        <Link
                            to="/app/review-requests"
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-2 p-2 rounded-md text-white  btn-primary ${isActive("/app/review-requests") ? "bg-white/20 backdrop-blur-lgs" : ""}`}
                        >
                            <Icon.Check size={24} />
                            <span>Revisar solicitações</span>
                        </Link>
                    )}

                    {userRole === "Administrador" && (
                        <Link
                            to="/app/users"
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-4 p-3 rounded-md text-white  btn-primary ${isActive("/app/users") ? "bg-white/20 backdrop-blur-lg" : ""}`}
                        >
                            <Icon.UserGear size={24} />
                            <span>Usuários</span>
                        </Link>
                    )}
                </div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full animate-float"></div>

                <div className="absolute left-28 w-24 h-24 bg-white/10 rounded-full animate-floatXY"></div>
                <div className="absolute bottom-16 left-12 w-8 h-8 bg-white/10 rounded-full animate-float-delayed"></div>
                <Flex className="absolute bottom-0 w-full p-4 max-xl:p-2 bg-white/20 backdrop-blur-lg">
                    <UserInfo className="text-white" />
                </Flex>
            </div>
        </>
    );
};
export default SideBar;