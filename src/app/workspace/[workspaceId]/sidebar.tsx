import { UserButton } from "@/features/auth/components/user-button"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { Separator } from "@/components/ui/separator"
import SidebarButton from "./sidebar-button"
import { Bell, Home, LucideHome, MessageSquare, MessageSquareCode, MessageSquareDiff, MoreHorizontal, SeparatorHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"
import { FaHome } from "react-icons/fa"

export const Sidebar = () => {
    const pathname = usePathname()
    return (
        <aside className="h-full bg-[#fdfcfa] flex flex-col w-[70px] gap-y-4 items-center pt-[9px] pb-4 border-r-[1px] border-solid border-[#e5e7eb]">
            <WorkspaceSwitcher />
            <Separator />
            <SidebarButton icon={Home} label={"主页"} isActive={pathname.includes("/workspace")} />
            <SidebarButton icon={MessageSquare} label={"私信"} />
            <SidebarButton icon={Bell} label={"提醒"} />
            <SidebarButton icon={MoreHorizontal} label={"更多"} />
            <div className="flex flex-col mt-auto">
                <UserButton />
            </div>
        </aside>
    )
}

