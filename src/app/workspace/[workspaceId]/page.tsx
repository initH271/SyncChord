"use client"
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace"
import {useWorkspaceId} from "@/hooks/use-workspace-id"
import LoadingPage from "@/components/loading-page";

interface WorkspaceIdPageProps {

}

export default function WorkSpaceIdPage(props: WorkspaceIdPageProps) {
    const workspaceId = useWorkspaceId()
    const {data, isLoading} = useGetWorkspace({id: workspaceId})

    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }
    return (
        <div className="flex h-full items-center justify-center bg-[#ffa ]">
            {data?.name} 的聊天台
        </div>
    )
}