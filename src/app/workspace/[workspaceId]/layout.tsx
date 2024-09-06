"use client"

import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import WorkSpaceSidebar from "./workspace-sidebar";

interface WorkSpaceIdLayoutProps {
    children: React.ReactNode;
}


export default function WorkSpaceIdLayout({ children }: WorkSpaceIdLayoutProps) {

    return (
        <div className="h-full bg-[#f3f0ed]">
            <Toolbar />
            <div className="h-[calc(100vh-40px)] flex ">
                <Sidebar />
                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId={"channel-workspace-layout"}
                >
                    <ResizablePanel defaultSize={15} maxSize={20} minSize={15}
                        className="bg-[#fdfcfa]">
                        <WorkSpaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={85} minSize={80} maxSize={85}>
                        {children}
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>
        </div>
    )
}

