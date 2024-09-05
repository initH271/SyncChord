import { UserButton } from "@/features/auth/components/user-button"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { Separator } from "@/components/ui/separator"
import SidebarButton from "./sidebar-button"
import { Home } from "lucide-react"

export const Sidebar = () => {
    return (
        <aside className="h-full bg-slate-500 flex flex-col w-[70px] gap-y-4 items-center pt-[9px] pb-4">
            <WorkspaceSwitcher />
            <SidebarButton icon={Home} label={"主页"} />
            <div className="">
                <UserButton />
            </div>
        </aside>
    )
}

