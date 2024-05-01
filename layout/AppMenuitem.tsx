'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useEffect, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from '@/layout/context/menucontext';
import { AppMenuItemProps } from '@/types';

const AppMenuitem = (props: AppMenuItemProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    // 检查当前项是否是活动路由。
    const isActiveRoute = item!.to && pathname === item!.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    const onRouteChange = (url: string) => {
        if (item!.to && item!.to === url) {
            setActiveMenu(key);
        }
    };

    useEffect(() => {
        onRouteChange(pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // avoid processing disabled items
        if (item!.disabled) {
            event.preventDefault();
            return;
        }

        // execute command
        if (item!.command) {
            item!.command({ originalEvent: event, item });
        }

        // toggle active state
        // 如果当前菜单项是活动状态 (active === true)，则将活动菜单设置为 props.parentKey（如果存在），否则设置为当前菜单项的 key。
        // 如果当前菜单项没有子菜单 (item!.items 为假)，则将活动菜单设置为当前菜单项的 key。
        if (item!.items) setActiveMenu(active ? (props.parentKey as string) : key);
        else setActiveMenu(key);
    };

    const subMenu = item!.items && item!.visible !== false && (
        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item!.label}>
            <ul>
                {item!.items.map((child, i) => {
                    return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {props.root && item!.visible !== false && <div className="layout-menuitem-root-text">{item!.label}</div>}
            {(!item!.to || item!.items) && item!.visible !== false ? (
                <a href={item!.url} onClick={(e) => itemClick(e)} className={classNames(item!.class, 'p-ripple')} target={item!.target} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null}

            {item!.to && !item!.items && item!.visible !== false ? (
                <Link href={item!.to} replace={item!.replaceUrl} target={item!.target} onClick={(e) => itemClick(e)} className={classNames(item!.class, 'p-ripple', { 'active-route': isActiveRoute })} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}

            {subMenu}
        </li>
    );
};

export default AppMenuitem;
