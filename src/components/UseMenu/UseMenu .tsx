// contexts/MenuContext.tsx
import { createContext, useContext, useState } from 'react';

type MenuContextType = {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
};

const MenuContext = createContext<MenuContextType>({} as MenuContextType);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
  };
  return (
    <MenuContext.Provider value={{ isMobileMenuOpen, toggleMobileMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);