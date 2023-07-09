import { CheckIcon, FilePlusIcon, HamburgerMenuIcon, HomeIcon, PersonIcon, ReaderIcon } from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Separator from "@radix-ui/react-separator";
import { Link } from "react-router-dom";

interface SideMenuExpandedProps {
    onCollapseMenuClicked: () => void;
    isMobile: boolean;
    showReviewOptions: boolean;
    showAdmOptions: boolean;
}

const SideMenuExpanded = ({
    onCollapseMenuClicked,
    isMobile,
    showReviewOptions,
    showAdmOptions,
}: SideMenuExpandedProps) => {
    return (
        <NavigationMenu.Root
            orientation="vertical"
            className={`bg-[#2F356D] text-white ${
                !isMobile
                    ? "sm:w-[45%] md:w-[34%] lg:w-[25%] xl:w-[18%] 2xl:w-[15%]"
                    : "absolute left-0 top-0 z-[9999] h-full w-full"
            }`}
        >
            <NavigationMenu.List className=" relative p-2">
                <NavigationMenu.Item className="w-full items-center">
                    GRUPAC
                    <HamburgerMenuIcon onClick={onCollapseMenuClicked} className="float-right h-[20px] w-[20px] " />
                </NavigationMenu.Item>
                <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                <NavigationMenu.Item className="my-6 flex items-center">
                    <HomeIcon className="mr-3" />
                    <NavigationMenu.Link>Dashboard</NavigationMenu.Link>
                </NavigationMenu.Item>
                <div className="flex items-center">
                    <p className="mr-4 text-xs text-[#83C3FF]">Pesquisa</p>
                    <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                </div>
                <NavigationMenu.Item className="my-6 flex items-center">
                    <ReaderIcon className="mr-3" />
                    <NavigationMenu.Link>Minhas Amostras</NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item className="my-6 flex items-center">
                    <FilePlusIcon className="mr-3" />
                    <Link to="createSample">Criar Amostra</Link>
                </NavigationMenu.Item>
                {showReviewOptions && (
                    <>
                        <div className="flex items-center">
                            <p className="mr-4 text-xs text-[#83C3FF]">Revisão</p>
                            <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                        </div>
                        <NavigationMenu.Item className="my-6 flex items-center">
                            <CheckIcon className="mr-3" />
                            <NavigationMenu.Link>Revisar Solicitações</NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </>
                )}
                {showAdmOptions && (
                    <>
                        <div className="flex items-center">
                            <p className="mr-4 text-xs text-[#83C3FF]">Administração</p>
                            <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                        </div>
                        <NavigationMenu.Item className="my-6 flex items-center">
                            <PersonIcon className="mr-3" />
                            <Link to="users">Usuários</Link>
                        </NavigationMenu.Item>
                    </>
                )}
            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
};

export default SideMenuExpanded;
