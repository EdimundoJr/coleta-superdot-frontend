import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { logoutUser } from "../../../api/auth.api";
import { Link } from "react-router-dom";

const InnerNavBar = () => {
    return (
        <NavigationMenu.Root className="bg-white drop-shadow-xl">
            <NavigationMenu.List>
                <NavigationMenu.Item className="flex justify-end p-4 text-black">
                    <Link to="home" className="mx-3">
                        <PersonIcon className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px]" />
                    </Link>
                    <Link onClick={logoutUser} to="/" className="mx-3">
                        <ExitIcon className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px]" />
                    </Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
};

export default InnerNavBar;
