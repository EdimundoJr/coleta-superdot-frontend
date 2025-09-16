import { Flex, Text } from '@radix-ui/themes';
import UserInfo from '../UserInfo/UserInfo';
import * as Icon from '@phosphor-icons/react';
import React from 'react';
import { useMenu } from '../UseMenu/UseMenu ';

interface HeaderProps {
    title: string;
    icon?: React.ReactNode;
    onMenuToggle?: () => void;
}

export function Header({ title, icon, onMenuToggle }: HeaderProps) {
    const { isMobileMenuOpen } = useMenu();


    return (
        <Flex
            asChild
            className={`w-full bg-white border-b border-gray-100 fixed top-0 z-30 h-16 px-4 sm:px-6 xl:pl-24 transition-all duration-300 ease-in-out max-xl:mt-11 shadow-bottom-lg`}
        >
            <header>
                <Flex align="center" className="w-full h-full">
                    {/* Left Section - Mobile Menu Button + Title */}
                    <Flex align="center" gap="4" className="flex-1">
                        <Flex align="center" className="text-gray-800 gap-3">
                            {icon && React.cloneElement(icon as React.ReactElement, {
                                className: "text-primary w-6 h-6"
                            })}
                            <h1 className="text-xl font-semibold truncate">
                                {title}
                            </h1>
                        </Flex>
                    </Flex>

                    {/* Right Section - User Info */}
                    <Flex align="center" gap="4" className="flex-shrink-0 mr-14 max-xl:!hidden">
                        <div className="hidden md:flex">
                            <UserInfo />
                        </div>

                    </Flex>
                </Flex>
            </header>
        </Flex>
    );
}