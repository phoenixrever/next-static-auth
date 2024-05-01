/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';

// 通过forwardRef创建组件 暴漏属性和方法给父组件使用
const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    // 通过useContext 访问 createContext({} as LayoutContextProps) 中的共享变量和方法
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);

    // 创建3个ref 通过useImperativeHandle 暴漏给父组件使用
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>SAKAI</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button border-none" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button border-none" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button  border-none">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <button type="button" className="p-link layout-topbar-button  border-none">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button  border-none">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
