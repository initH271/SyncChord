import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader2, TriangleAlert } from "lucide-react"
import WorkSpaceSidebarHeader from "./workspace-sidebar-header"

export default function WorkSpaceSidebar() {
    const workspaceId = useWorkspaceId()
    const { data: currentMember, isLoading: memberLoading } = useCurrentMember({ workspaceId })
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })

    if (workspaceLoading || memberLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="size-10 animate-spin" />
                {/* <LoadingProgress className="w-[80%]" /> */}
            </div>
        )
    }
    if (!workspace || !currentMember) {
        return (
            <div className="flex  gap-x-2 items-center justify-center h-full">
                <TriangleAlert className="size-5" />
                <p className="text-sm">
                    未找到工作空间!
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <WorkSpaceSidebarHeader workspace={workspace} isAdmin={currentMember.role == "admin"} />
        </div>
    )
}

