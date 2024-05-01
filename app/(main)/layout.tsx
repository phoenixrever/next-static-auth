import React from 'react';
import { Metadata } from 'next';
import Layout from '@/layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}
/**
 * Open Graph 是一种协议，用于标记 HTML 页面中的元数据，以便在社交媒体平台上分享时提供更丰富的预览信息。

    type: 指定了分享的内容类型，这里是一个网站 ('website')。
    title: 网站的标题，可能会显示在分享预览中。
    url: 网站的 URL 地址。
    description: 对网站的简短描述，通常会在分享预览中显示。
    images: 包含了一组图片的 URL，用于在分享时显示预览图像。
    ttl: 表示这些元数据的生存时间（Time To Live），以秒为单位。在这里，它表示这些元数据的缓存时间，即多久后需要重新获取这些元数据。
    总的来说，这段代码提供了一组用于描述网站内容的元数据，这些元数据可以在分享时提供更好的预览效果，以吸引用户点击。
 */

export const metadata: Metadata = {
    title: '私のAuthのTemplate',
    description: 'my precious template for next-auth and primeReact.',
    robots: { index: false, follow: false },
    // viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'My Precious',
        url: 'https://phoenixhell.com',
        description: 'my precious.',
        images: ['https://pengxiangli.wordpress.com/wp-content/uploads/2017/02/my-precious.jpg'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
