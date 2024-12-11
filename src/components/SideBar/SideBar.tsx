import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { USER_ROLE } from "../../utils/consts.utils";
import * as Icon from "@phosphor-icons/react"
import { useEffect, useState } from "react";
import { getUser, Users } from "../../api/researchers.api";


interface SideBarProps {
    userRole: USER_ROLE;
}


const SideBar = ({ userRole }: SideBarProps) => {
    const [expanded, setExpanded] = useState(false);
    const [userData, setUserData] = useState<null | Users>(null);
    const [error, setError] = useState<Error | null>(null);


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
    function isActive(...pathNames: string[]) {
        return pathNames.includes(location.pathname) ? "bg-secondary text-white rounded transition-all ease-in-out flex  items-center hover:translate-x-5  translate-x-5" : "";
    }
    function isActiveIcon(...pathNames: string[]) {
        return pathNames.includes(location.pathname) ? "bold" : "thin";
    }


    const Menus = [
        { title: "Dashboard", icon: <Icon.SquaresFour weight={`${isActiveIcon("/app/home")}`} size={24} />, link: "/app/home", active: `${isActive("/app/home")}` },
        { title: "Minhas Amostras", icon: <Icon.Books weight={`${isActiveIcon("/app/my-samples", "/app/my-samples/analyze-sample", "/app/my-samples/participants-registration", "/app/my-samples/seconds-source-compare", "/app/my-samples/evaluate-autobiography", "/app/my-samples/compare-participants-selected", "/app/edit-sample")}`} size={24} />, link: "/app/my-samples", active: `${isActive("/app/my-samples", "/app/my-samples/analyze-sample", "/app/my-samples/seconds-source-compare", "/app/my-samples/participants-registration", "/app/my-samples/evaluate-autobiography", "/app/my-samples/compare-participants-selected", "/app/edit-sample")}` },
        { title: "Criar Amostras", icon: <Icon.FolderSimplePlus weight={`${isActiveIcon("/app/create-sample", "/app/choose-sample-group")}`} size={24} />, link: "/app/create-sample", active: `${isActive("/app/choose-sample-group", "/app/create-sample")}` },



    ];


    return (

        <NavigationMenu.Root className={` h-screen bg-primary duration-300 ${expanded ? 'w-80' : 'w-20'} `}>
            <NavigationMenu.List className={`fixed p-4`}>
                <NavigationMenu.Item className="flex p-2 mb-[26px] mt-[26px] justify-between text-alternative-text">
                    {expanded ? (
                        <>
                            <Icon.X size={24} onClick={() => setExpanded(false)} className="cursor-pointer" />
                        </>
                    ) : (
                        <Icon.List size={24} onClick={() => setExpanded(true)}
                            className="cursor-pointer transition-all ease-out" />
                    )}
                    <h2 className={`origin-left ${!expanded && "scale-0"} text-white  font-medium text-xl duration-200 "}`}>SUPERDOT</h2>
                </NavigationMenu.Item>
                {Menus.map((Menu, index) => (
                    <NavigationMenu.Item key={index} className={`flex p-2 mb-[26px] mt-[26px] justify-between hover:bg-secondary hover:rounded text-alternative-text ${Menu.active} hover:translate-x-0.5 transition-all ease-in-out `}>
                        {Menu.link && (
                            <Link to={Menu.link!} className={`flex gap-3 `}>
                                {Menu.icon}
                                <h2 className={`origin-left ${!expanded ? "scale-0" : ""} duration-300 `}>{Menu.title}</h2>
                            </Link>
                        )}
                    </NavigationMenu.Item>
                ))}

                {userRole.match("Revisor|Administrador") && (
                    <>
                        <NavigationMenu.Item
                            className={`flex p-2 mb-[26px] mt-[26px] justify-between hover:bg-secondary hover:rounded text-alternative-text hover:translate-x-0.5 transition-all ease-in-out ${isActive("/app/review-requests")}`}
                        >
                            <Link to="/app/review-requests" className="flex gap-3">
                                <Icon.Check weight={`${isActiveIcon("/app/review-requests")}`} size={24} />
                                <h2 className={`origin-left ${!expanded && "scale-0"} duration-300`}>Revisar solicitações</h2>
                            </Link>
                        </NavigationMenu.Item>
                    </>
                )}
                {userRole === "Administrador" && (
                    <>
                        <NavigationMenu.Item className={`flex p-2 mb-[26px] mt-[26px] justify-between hover:bg-secondary hover:rounded text-alternative-text hover:translate-x-0.5 transition-all ease-in-out ${isActive("/app/users")}`}>
                            <Link to="/app/users" className="flex gap-3">
                                <Icon.UserGear weight={`${isActiveIcon("/app/users")}`} size={24} />
                                <h2 className={`origin-left ${!expanded && "scale-0"} duration-300`}>Usuários</h2>
                            </Link>
                        </NavigationMenu.Item>
                    </>
                )}

            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
};
export default SideBar;


