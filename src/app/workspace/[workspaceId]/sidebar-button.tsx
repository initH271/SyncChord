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
        <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
            <Button className={cn("size-9 p-2 group-hover:bg-accent/20", isActive && "bg-accent/20")}>
                <Icon />
            </Button>
            <p>
                {label}
            </p>
        </div>
    )
}