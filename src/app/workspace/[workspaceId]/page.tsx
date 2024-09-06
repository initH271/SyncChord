"use client"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader } from "lucide-react"

interface WorkspaceIdPageProps {

}

export default function WorkSpaceIdPage(props: WorkspaceIdPageProps) {
    const workspaceId = useWorkspaceId()
    const { data, isLoading } = useGetWorkspace({ id: workspaceId })

    if (isLoading) {
        return (
            <Loader className="size-4" />
        )
    }
    return (
        <div>
            欢迎来到工作空间 {data?.name}
        </div>
    )
}