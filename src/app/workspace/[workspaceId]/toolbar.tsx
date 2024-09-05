import { Button } from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader, Search, Info } from "lucide-react"

export const Toolbar = () => {
    const workspaceId = useWorkspaceId()
    const { data, isLoading } = useGetWorkspace({ id: workspaceId })
    if (isLoading) {
        return (
            <div className="bg-slate-500 flex items-center justify-center h-10 p-1.5">
                <Loader className="size-4 text-white" />

            </div>
        )
    }
    const { name } = data!
    return (
        <nav className="bg-slate-500 flex items-center justify-center h-10 p-1.5">
            <div className="flex-1">

            </div>
            <div className="min-w-[280px] max-w-[682px] grow-[2] shrink">
                <Button className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2" size={"sm"}>
                    <Search className="size-4 text-white mr-2" />
                    <span className="text-white text-xs">
                        在 {name} 中搜索
                    </span>
                </Button>
            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button className="bg-transparent hover:bg-accent/10 text-accent" size={"sm"} variant={"ghost"}>
                    <Info className="size-5 text-white" />
                    <span >

                    </span>
                </Button>
            </div>
        </nav>
    )
}