/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEventListener, useMountEffect, useUnmountEffect } from 'primereact/hooks';
import React, { useContext, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import AppFooter from '@/layout/AppFooter';
import AppSidebar from '@/layout/AppSidebar';
import AppTopbar from '@/layout/AppTopbar';
import AppConfig from '@/layout/AppConfig';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';
import { ChildContainerProps, LayoutState, AppTopbarRef } from '@/types';

const Layout = ({ children }: ChildContainerProps) => {
    // useContext 访问 createContext({} as LayoutContextProps) 中的共享变量
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const { setRipple } = useContext(PrimeReactContext);

    // 通过forwardRef 拿到子组件的 属性 和可能用useImperativeHandle 暴漏出来的方法
    const topbarRef = useRef<AppTopbarRef>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    /**
     *  useEventListener 用法见  https://primereact.org/hooks/useeventlistener/
     *  在 listener 中，首先检查了事件触发的目标是否位于侧边栏 (sidebarRef) 或顶部栏 (topbarRef) 中。
     *  如果不是，则表示用户点击了侧边栏以外的区域，此时调用了 hideMenu 函数，这个函数可能是用来隐藏菜单的。
     *
     *  这种模式通常用于实现点击元素以外的区域来关闭菜单或者弹出框等功能。通过这种方式，你可以很方便地实现这样的交互效果，而无需手动管理事件监听器的绑定和解绑。
     */
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                sidebarRef.current?.isSameNode(event.target as Node) ||
                sidebarRef.current?.contains(event.target as Node) ||
                topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.menubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        hideMenu();
        hideProfileMenu();
    }, [pathname, searchParams]);

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current?.topbarmenu?.isSameNode(event.target as Node) ||
                topbarRef.current?.topbarmenu?.contains(event.target as Node) ||
                topbarRef.current?.topbarmenubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.topbarmenubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false
        }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            profileSidebarVisible: false
        }));
        unbindProfileMenuOutsideClickListener();
    };

    /**
     * classList 属性返回的是一个 DOMTokenList 对象，它包含了元素的类名列表。
     * 通过这个对象，你可以方便地添加、删除和切换类名，从而实现对元素类名的动态控制。
     */
    const blockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    /**
     * 1. document.body.className 获取了 <body> 元素的类名字符串。
     * 2. new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi') 创建了一个正则表达式，用于匹配类名中包含 blocked-scroll 的部分。
     * 3. 这里使用了正则表达式中的 \b 来匹配单词边界，以确保只匹配完整的类名。
     * 4. replace() 方法将匹配到的部分替换为空字符串，从而实现移除操作。
     */
    const unblockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    return (
        <React.Fragment>
            <div className={containerClass}>
                <AppTopbar ref={topbarRef} />
                <div ref={sidebarRef} className="layout-sidebar">
                    <AppSidebar />
                </div>
                <div className="layout-main-container">
                    <div className="layout-main">{children}</div>
                    <AppFooter />
                </div>
                <AppConfig />
                {/* 创建一个覆盖整个页面的半透明遮罩，以防止用户与页面的其他部分进行交互。
                这样可以确保在侧边栏展开或模态框打开时，用户只能与侧边栏或模态框进行交互，而不会干扰到页面的其他部分。
                TODO 目前没发现
                */}
                <div className="layout-mask"></div>
            </div>
        </React.Fragment>
    );
};

export default Layout;
