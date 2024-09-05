import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"

interface SidebarButtonProps {
    icon: LucideIcon | IconType;
    label: string;
    isActive?: boolean;
}


export default function SidebarButton(props: SidebarButtonProps) {
    const { icon: Icon, label, isActive } = props
    return (
        <div className="flex flex-col items-center justify-center gap-y-1 text-black cursor-pointer group">
            <Button className={cn("size-10 p-2 bg-transparent text-black group-hover:bg-[#f0eeeb]", isActive && "bg-[#f0eeeb] scale-110 transition-all")}>
                <Icon className="group-hover:scale-110 transition-all" />
            </Button>
            <p className="text-xs font-semibold text-black/90">
                {label}
            </p>
        </div>
    )
}