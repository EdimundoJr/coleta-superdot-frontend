import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ExitIcon, HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";
import { logoutUser } from "../../../api/auth.api";
import { Link } from "react-router-dom";

interface InnerNavBarProps {
    onExpandMenuClicked: () => void;
    isMobile: boolean;
}

const InnerNavBar = ({ onExpandMenuClicked, isMobile }: InnerNavBarProps) => {
    return (
        <NavigationMenu.Root className="bg-white drop-shadow-xl">
            <NavigationMenu.List className={`flex ${!isMobile ? "justify-end" : "justify-between"} p-4`}>
                {isMobile && (
                    <NavigationMenu.Item className="flex items-center text-black">
                        <HamburgerMenuIcon
                            onClick={onExpandMenuClicked}
                            className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px]"
                        />
                    </NavigationMenu.Item>
                )}
                <div className="flex">
                    <NavigationMenu.Item className="mx-3 flex items-center text-black">
                        <Link to="home">
                            <PersonIcon className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px]" />
                        </Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item className="mx-3 flex items-center text-black">
                        <Link onClick={logoutUser} to="/">
                            <ExitIcon className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px]" />
                        </Link>
                    </NavigationMenu.Item>
                </div>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
};

export default InnerNavBar;
