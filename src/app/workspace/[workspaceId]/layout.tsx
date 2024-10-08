"use client"

import {Toolbar} from "./toolbar";
import {Sidebar} from "./sidebar";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import WorkSpaceSidebar from "./workspace-sidebar";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import LoadingPage from "@/components/loading-page";
import {ReactNode, useEffect} from "react";
import {useRouter} from "next/navigation";
import NoContentPage from "@/components/no-content-page";
import {usePanel} from "@/hooks/use-panel";
import {Loader2} from "lucide-react";
import ThreadPanel from "@/components/thread-panel";
import {Id} from "../../../../convex/_generated/dataModel";

interface WorkSpaceIdLayoutProps {
    children: ReactNode;
}


export default function WorkSpaceIdLayout({children}: WorkSpaceIdLayoutProps) {
    const workspaceId = useWorkspaceId()
    const {data, isLoading} = useGetWorkspace({id: workspaceId})
    const router = useRouter()
    const {parentMessageId, onCloseMessage} = usePanel()
    const showPanel = !!parentMessageId;
    useEffect(() => {
        if (isLoading) return;
        if (!data) router.push("/");
    }, [isLoading, data, router]);
    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }
    if (!data) {
        return <NoContentPage content={"找不到正确的工作空间"}/>
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

                    <ResizablePanel defaultSize={85} minSize={40} maxSize={85}>
                        {children}
                    </ResizablePanel>
                    {showPanel && (
                        <>
                            <ResizableHandle withHandle/>
                            <ResizablePanel defaultSize={30} minSize={20}>
                                {parentMessageId ?
                                    (<ThreadPanel
                                        messageId={parentMessageId as Id<"messages">}
                                        onCloseThread={onCloseMessage}
                                    />) :
                                    (<div className={"flex h-full items-center justify-center"}>
                                        <Loader2 className={"animate-spin size-7 text-muted-foreground"}/>
                                    </div>)
                                }
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    )
}

