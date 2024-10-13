import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ConvexClientProvider} from "@/components/convex-client-provider";
import {ConvexAuthNextjsServerProvider} from "@convex-dev/auth/nextjs/server";
import {JotaiProviders} from "@/components/jotai-provider";
import {Modals} from "@/components/models";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Sync-Chord",
    description: "一个具有实时聊天、团队协作、频道管理等功能的平台.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="zh">
            <body className={inter.className}>
            <ConvexClientProvider>
                <JotaiProviders>
                    <Toaster/>
                    <Modals/>
                    {children}
                </JotaiProviders>
            </ConvexClientProvider>
            </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
