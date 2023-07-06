import { CheckIcon, FilePlusIcon, HamburgerMenuIcon, HomeIcon, PersonIcon, ReaderIcon } from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Separator from "@radix-ui/react-separator";

interface SideMenuCollapsedProps {
    onExpandMenuClicked: () => void;
    isMobile: boolean;
    showReviewOptions: boolean;
    showAdmOptions: boolean;
}

const SideMenuCollapsed = ({
    onExpandMenuClicked,
    showReviewOptions,
    showAdmOptions,
    isMobile,
}: SideMenuCollapsedProps) => {
    return (
        <>
            {!isMobile && (
                <NavigationMenu.Root orientation="vertical" className="bg-[#2F356D] text-white">
                    <NavigationMenu.List className="p-2">
                        <NavigationMenu.Item className="flex w-full justify-center">
                            <HamburgerMenuIcon onClick={onExpandMenuClicked} className="h-[20px] w-[20px]" />
                        </NavigationMenu.Item>
                        <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                        <NavigationMenu.Item className="my-6 flex justify-center">
                            <HomeIcon className="h-[20px] w-[20px]" />
                        </NavigationMenu.Item>
                        <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                        <NavigationMenu.Item className="my-6 flex justify-center">
                            <ReaderIcon className="h-[20px] w-[20px]" />
                        </NavigationMenu.Item>
                        <NavigationMenu.Item className="my-6 flex justify-center">
                            <FilePlusIcon className="h-[20px] w-[20px]" />
                        </NavigationMenu.Item>
                        {showReviewOptions && (
                            <>
                                <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                                <NavigationMenu.Item className="my-6 flex justify-center">
                                    <CheckIcon className="h-[20px] w-[20px]" />
                                </NavigationMenu.Item>
                            </>
                        )}
                        {showAdmOptions && (
                            <>
                                <Separator.Root className="my-[15px] h-px w-full bg-violet6" />
                                <NavigationMenu.Item className="my-6 flex justify-center">
                                    <PersonIcon className="h-[20px] w-[20px]" />
                                </NavigationMenu.Item>
                            </>
                        )}
                    </NavigationMenu.List>
                </NavigationMenu.Root>
            )}
        </>
    );
};

export default SideMenuCollapsed;
