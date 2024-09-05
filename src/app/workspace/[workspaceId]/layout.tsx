"use client"

import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";

interface WorkSpaceIdLayoutProps {
    children: React.ReactNode;
}


export default function WorkSpaceIdLayout({ children }: WorkSpaceIdLayoutProps) {
    return (
        <div className="h-full bg-[#f3f0ed]">
            <Toolbar />
            <div className="h-[calc(100vh-40px)] flex ">
                <Sidebar />
                {children}

            </div>
        </div>
    )
}

