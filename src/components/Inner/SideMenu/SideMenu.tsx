import { useState } from "react";
import SideMenuCollapsed from "./SideMenuCollapsed/SideMenuCollapsed";
import SideMenuExpanded from "./SideMenuExpanded/SideMenuExpanded";
import { isMobile } from "../../../utils/mediaQuery.utils";

interface SideMenuProps {
    userRole: string;
}

const SideMenu = ({ userRole }: SideMenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {menuOpen ? (
                <SideMenuExpanded
                    showReviewOptions={
                        userRole === import.meta.env.VITE_ROLE_REVIEWER || userRole === import.meta.env.VITE_ROLE_ADM
                    }
                    showAdmOptions={userRole === import.meta.env.VITE_ROLE_ADM}
                    isMobile={isMobile()}
                    onCollapseMenuClicked={() => setMenuOpen(false)}
                />
            ) : (
                <SideMenuCollapsed
                    showReviewOptions={
                        userRole === import.meta.env.VITE_ROLE_REVIEWER || userRole === import.meta.env.VITE_ROLE_ADM
                    }
                    showAdmOptions={userRole === import.meta.env.VITE_ROLE_ADM}
                    isMobile={isMobile()}
                    onExpandMenuClicked={() => setMenuOpen(true)}
                />
            )}
        </>
    );
};

export default SideMenu;
