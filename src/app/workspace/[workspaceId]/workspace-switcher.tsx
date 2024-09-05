import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { LoaderCircle, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export const WorkspaceSwitcher = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces()
    const [_open, setOpen] = useCreateWorkspaceModal()
    const filterWorkspaces = workspaces!.filter((ws) => ws._id !== workspaceId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {
                    workspaceLoading ? <LoaderCircle />
                        : (<div className="size-10 rounded-sm relative flex justify-center items-center overflow-hidden bg-[#7a7ab4] hover:bg-[#3b3b89]  font-semibold text-xl text-white">
                            {workspace?.name.charAt(0).toUpperCase()}
                        </div>)
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-64">
                <DropdownMenuItem className="flex-col cursor-pointer justify-start items-start capitalize">
                    {workspace?.name}
                    <span className="text-xs text-muted-foreground">
                        当前激活空间
                    </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {
                    workspacesLoading ? <LoaderCircle className="cursor-pointer justify-start items-center capitalize font-semibold flex" /> : filterWorkspaces.map((ws) =>
                    (
                        <DropdownMenuItem
                            key={ws._id}
                            onClick={() => { router.push(`/workspace/${ws._id}`) }}
                            className="cursor-pointer justify-start items-center capitalize font-semibold flex">
                            <div className="size-10 relative overflow-hidden bg-[#2b90bb] text-white font-semibold text-lg flex justify-center items-center rounded-md mr-2">
                                {ws?.name.charAt(0).toUpperCase()}
                            </div>
                            {ws?.name}
                        </DropdownMenuItem>
                    )
                    )
                }
                <DropdownMenuItem
                    onClick={() => { setOpen(true) }}
                    className="cursor-pointer justify-start items-center flex"
                >
                    <div className="size-10 relative overflow-hidden bg-[#807c7c] text-white font-semibold text-lg flex justify-center items-center rounded-md mr-2">
                        <Plus />
                    </div>
                    创建工作空间
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}