"use client"

import {Toolbar} from "./toolbar";
import {Sidebar} from "./sidebar";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import WorkSpaceSidebar from "./workspace-sidebar";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import LoadingPage from "@/components/loading-page";

interface WorkSpaceIdLayoutProps {
    children: React.ReactNode;
}


export default function WorkSpaceIdLayout({children}: WorkSpaceIdLayoutProps) {
    const workspaceId = useWorkspaceId()
    const {isLoading} = useGetWorkspace({id: workspaceId})

    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }
    return (
        <div className="h-full bg-[#f3f0ed]">
            <Toolbar/>
            <div className="h-[calc(100vh-40px)] flex ">
                <Sidebar/>
                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId={"channel-workspace-layout"}
                >
                    <ResizablePanel defaultSize={15} maxSize={20} minSize={15}
                                    className="bg-[#fdfcfa]">
                        <WorkSpaceSidebar/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>

                    <ResizablePanel defaultSize={85} minSize={80} maxSize={85}>
                        {children}
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>
        </div>
    )
}

