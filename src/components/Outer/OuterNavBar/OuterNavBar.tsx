import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const OuterNavBar = () => {
    return (
        <NavigationMenu.Root>
            <NavigationMenu.List>
                <NavigationMenu.Item className="flex justify-start px-4 pt-4 text-2xl sm:px-14 sm:pt-6">
                    <NavigationMenu.Link>GRUPAC</NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
};

export default OuterNavBar;
