"use client"

import { Toolbar } from "./toolbar";

interface WorkSpaceIdLayoutProps {
    children: React.ReactNode;
}


export default function WorkSpaceIdLayout({ children }: WorkSpaceIdLayoutProps) {
    return (
        <div className="h-full">
            <Toolbar />
            {children}
        </div>
    )
}

