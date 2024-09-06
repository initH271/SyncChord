"use client"
import LoadingProgress from "@/components/loading-progress"
import { Button } from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Search, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const Toolbar = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const { data, isLoading } = useGetWorkspace({ id: workspaceId })
    useEffect(() => {
        if (!isLoading && data === null) {
            router.push("/")
        }
    }, [data, router, isLoading])
    if (isLoading) {
        return (
            <div className="bg-[#fdfcfa] flex items-center justify-center h-10 p-1.5 border-solid border-b-[1px] border-[#e5e7eb]">
                {/* <Loader2 className="size-8 text-black animate-spin" /> */}
                <LoadingProgress className="w-[80%] h-1" />
            </div>
        )
    }


    return (
        <nav className="bg-[#fdfcfa] flex items-center justify-center h-10 p-1.5 border-solid border-b-[1px] border-[#e5e7eb]">
            <div className="flex-1">

            </div>
            <div className="min-w-[280px] max-w-[682px] grow-[2] shrink">
                <Button className="bg-transparent hover:bg-[#f0eeeb] w-full justify-start h-7 px-2 border-[1px] border-black" size={"sm"}>
                    <Search className="size-4 text-black mr-2 " />
                    <span className="text-black/100 text-xs">
                        在 {data?.name} 中搜索
                    </span>
                </Button>
            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button className="bg-transparent hover:bg-[#f0eeeb] text-accent" size={"sm"} variant={"ghost"}>
                    <Info className="size-5 text-black font-semibold" />
                </Button>
            </div>
        </nav>
    )
}