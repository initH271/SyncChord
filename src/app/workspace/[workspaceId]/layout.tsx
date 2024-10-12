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
import Profile from "@/components/profile";

interface WorkSpaceIdLayoutProps {
    children: ReactNode;
}


export default function WorkSpaceIdLayout({children}: WorkSpaceIdLayoutProps) {
    const workspaceId = useWorkspaceId()
    const {data, isLoading} = useGetWorkspace({id: workspaceId})
    const router = useRouter()
    const {parentMessageId, profileMemberId, onCloseMessage, onCloseProfile} = usePanel()
    const showMessagePanel = !!parentMessageId;
    const showProfilePanel = !!profileMemberId;
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
                    <ResizablePanel id={"ws-0"} order={0} defaultSize={15} maxSize={20} minSize={15}
                                    className="bg-[#fdfcfa]">
                        <WorkSpaceSidebar/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>

                    <ResizablePanel id={"ws-1"} order={1} defaultSize={55} minSize={40} maxSize={85}>
                        {children}
                    </ResizablePanel>
                    {showMessagePanel && ( // thread面板
                        <>
                            <ResizableHandle withHandle/>
                            <ResizablePanel id={`ws-2-${parentMessageId}`} order={2} key={parentMessageId}
                                            defaultSize={30}
                                            minSize={20}>
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
                    {showProfilePanel && ( // member个人信息面板
                        <>
                            <ResizableHandle withHandle/>
                            <ResizablePanel id={`ws-3-${profileMemberId}`} order={3} key={profileMemberId}
                                            defaultSize={40}
                                            minSize={20}>
                                {profileMemberId ?
                                    (<Profile memberId={profileMemberId} onClose={onCloseProfile}/>) :
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

