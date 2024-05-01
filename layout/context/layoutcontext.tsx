'use client';
import React, { useState, createContext } from 'react';
import { LayoutState, ChildContainerProps, LayoutConfig, LayoutContextProps } from '@/types';

/**
 * as TS语法种的 断言 空对象类型为LayoutContextProps （类似 age：number）
 * createContext 配合 useContext 使用在组件种共享变量。
 */
export const LayoutContext = createContext({} as LayoutContextProps);

export const LayoutProvider = ({ children }: ChildContainerProps) => {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false, // toggles ripple on and off
        inputStyle: 'outlined', // default style for input elements
        menuMode: 'static', // layout mode of the menu, valid values are "static" or "overlay"
        colorScheme: 'light', // color scheme of the template, valid values are "light", "dim" and "dark"
        theme: 'lara-light-indigo', // default component theme for PrimeReact
        scale: 16 // size of the body font size to scale the whole application
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
            }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            profileSidebarVisible: !prevLayoutState.profileSidebarVisible
        }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar
    };

    /**
     * value 属性指定了当前上下文的值。
     * 在需要访问上下文的地方，使用 const contextValue = useContext(LayoutContext);
     * contextValue 变量现在包含了当前上下文（value ）的值。
     */
    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
