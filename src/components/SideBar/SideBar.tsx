import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom";
import { USER_ROLE } from "../../utils/consts.utils";
import { clearTokens } from "../../utils/tokensHandler";
import {  Box } from "@radix-ui/themes";
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


    const navigate = useNavigate();

    const logout = () => {
        clearTokens();
        navigate("/");
    };

    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };
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
        return pathNames.includes(location.pathname) ? "bg-[#9873FA] text-white rounded transition-all ease-in-out flex  items-center hover:translate-x-5  translate-x-5" : "";
    }
    function isActiveIcon(...pathNames: string[]) {
        return pathNames.includes(location.pathname) ? "bold" : "thin";
    }


    const Menus = [
        { title: "Dashboard", icon: <Icon.SquaresFour weight={`${isActiveIcon("/app/home")}`} size={24} />, link: "/app/home", active: `${isActive("/app/home")}` },
        { title: "Minhas Amostras", icon: <Icon.Books weight={`${isActiveIcon("/app/my-samples", "/app/analyze-sample", "/app/participants-registration", "/app/seconds-source-compare", "/app/evaluate-autobiography", "/app/compare-participants-selected", "/app/edit-sample")}`} size={24} />, link: "/app/my-samples", active: `${isActive("/app/my-samples", "/app/analyze-sample", "/app/seconds-source-compare", "/app/participants-registration", "/app/evaluate-autobiography", "/app/compare-participants-selected", "/app/edit-sample")}` },
        { title: "Criar Amostras", icon: <Icon.FolderSimplePlus weight={`${isActiveIcon("/app/create-sample", "/app/choose-sample-group")}`} size={24} />, link: "/app/create-sample", active: `${isActive("/app/choose-sample-group", "/app/create-sample")}` },



    ];


    return (
        <Box className={`relative h-screen bg-primary duration-300 ${expanded ? 'w-80' : 'w-20'} `}>
            <NavigationMenu.Root >
                <NavigationMenu.List className={`fixed p-4`}>
                    <NavigationMenu.Item className="flex p-2 mb-[26px] mt-[26px] justify-between text-alternative-text ">
                        {expanded ? (
                            <>
                                <Icon.X size={24} onClick={() => setExpanded(false)} className="cursor-pointer" />
                            </>
                        ) : (

                            <Icon.List size={24} onClick={() => setExpanded(true)}
                                className="cursor-pointer transition-all ease-out" />


                        )}
                        <h2 className={`origin-left ${!expanded && "scale-0"} text-white  font-medium text-xl duration-200 "}`}>SUPERDOT</h2>

                        <AlertDialog.Root>
                            <AlertDialog.Trigger asChild className={`fixed  duration-300  bottom-0 left-0  bg-secondary text-alternative-text  `}>
                                <button className={`flex items-center m-auto px-7 gap-24 py-5 justify-between hover:-translate-x-0.5 transition-all ease-in-out`}>

                                    <Icon.SignOut size={27} />

                                    {/* <Card variant="ghost" className={`${!expanded && "scale-0"} duration-300`} >
                                        <Flex align="center">
                                            <Flex direction="column" justify="end">
                                                <Text as="div" weight="bold" className="text-[10px]">
                                                    {getFirstAndLastName(`${userData?.fullName}`)}
                                                </Text>
                                                <Text as="div" weight="light" className="text-[8px] italic" >
                                                    {userRole}
                                                </Text>
                                            </Flex>


                                        </Flex>
                                    </Card> */}
                                </button>


                            </AlertDialog.Trigger>
                            <AlertDialog.Portal >
                                <AlertDialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
                                <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                                    <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium  ">
                                        Tem certeza que deseja sair da plataforma?
                                    </AlertDialog.Title>
                                    <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">

                                    </AlertDialog.Description>
                                    <div className="flex justify-end gap-[25px]">
                                        <AlertDialog.Cancel asChild>
                                            <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                                                Cancelar
                                            </button>
                                        </AlertDialog.Cancel>
                                        <AlertDialog.Action onClick={logout}
                                            asChild>
                                            <button className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                                                Sim, desejo sair
                                            </button>
                                        </AlertDialog.Action>
                                    </div>
                                </AlertDialog.Content>
                            </AlertDialog.Portal>
                        </AlertDialog.Root>

                    </NavigationMenu.Item>
                    {Menus.map((Menu, index) => (
                        <NavigationMenu.Item key={index} className={`flex p-2 mb-[26px] mt-[26px] justify-between hover:bg-[#9873FA] hover:rounded text-alternative-text ${Menu.active} hover:translate-x-0.5 transition-all ease-in-out `}>
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
                                className={`flex p-2 mb-[26px] mt-[26px] justify-between hover:bg-[#9873FA] hover:rounded text-alternative-text hover:translate-x-0.5 transition-all ease-in-out ${isActive("/app/review-requests")}`}
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
                            <NavigationMenu.Item className={`flex p-2 mb-[26px] mt-[26px] justify-between hover:bg-[#9873FA] hover:rounded text-alternative-text hover:translate-x-0.5 transition-all ease-in-out ${isActive("/app/users")}`}>
                                <Link to="/app/users" className="flex gap-3">
                                    <Icon.UserGear weight="thin" size={24} />
                                    <h2 className={`origin-left ${!expanded && "scale-0"} duration-300`}>Usuários</h2>
                                </Link>
                            </NavigationMenu.Item>
                        </>
                    )}

                </NavigationMenu.List>

            </NavigationMenu.Root>



        </Box>
    );
};
export default SideBar;


