import {LucideIcon} from "lucide-react";
import {IconType} from "react-icons/lib";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const sidebarItemVariants = cva(
    "flex items-center justify-start w-full gap-1.5 font-normal px-[18px] overflow-hidden",
    {
        variants: {
            variant: {
                default: "",
                active: "font-semibold bg-[#f0eeeb]"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

interface WorkspaceSidebarItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType;
    variant?: VariantProps<typeof sidebarItemVariants>["variant"]
}

// workspace侧边栏项组件
export default function WorkspaceSidebarItem({id, icon: Icon, label, variant}: WorkspaceSidebarItemProps) {
    const workspaceId = useWorkspaceId()
    return (
        <Button variant={"stone"} className={cn(sidebarItemVariants({variant}))} asChild>
            <Link href={`/workspaces/${workspaceId}/channel/${id}`}>
                <Icon className={"size-5 shrink-0 mr-1"}/>
                <span className={"text-sm truncate"}>{label}</span>
            </Link>
        </Button>
    )
}