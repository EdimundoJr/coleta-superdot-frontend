import { useState } from "react";
import SideMenuCollapsed from "./SideMenuCollapsed/SideMenuCollapsed";
import SideMenuExpanded from "./SideMenuExpanded/SideMenuExpanded";
import { isMobile } from "../../../utils/mediaQuery.utils";

interface SideMenuProps {
    userRole: string;
    menuOpen: boolean;
    onCollapseMenuClicked: () => void;
    onExpandMenuClicked: () => void;
}

const SideMenu = ({ userRole, menuOpen, onExpandMenuClicked, onCollapseMenuClicked }: SideMenuProps) => {
    return (
        <>
            {menuOpen ? (
                <SideMenuExpanded
                    showReviewOptions={
                        userRole === import.meta.env.VITE_ROLE_REVIEWER || userRole === import.meta.env.VITE_ROLE_ADM
                    }
                    showAdmOptions={userRole === import.meta.env.VITE_ROLE_ADM}
                    isMobile={isMobile()}
                    onCollapseMenuClicked={onCollapseMenuClicked}
                />
            ) : (
                <SideMenuCollapsed
                    showReviewOptions={
                        userRole === import.meta.env.VITE_ROLE_REVIEWER || userRole === import.meta.env.VITE_ROLE_ADM
                    }
                    showAdmOptions={userRole === import.meta.env.VITE_ROLE_ADM}
                    isMobile={isMobile()}
                    onExpandMenuClicked={onExpandMenuClicked}
                />
            )}
        </>
    );
};

export default SideMenu;
