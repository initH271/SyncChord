import {Doc, Id} from "../../../../convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useCurrentMember} from "@/features/members/api/use-current-member";

const userItemVariants = cva(
    "flex items-center justify-start gap-1.5 font-normal px-4 overflow-hidden",
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

interface WorkspaceSidebarUserItemProps {
    user: Doc<"users">,
    variant?: VariantProps<typeof userItemVariants>["variant"],
    id: Id<"members">
}

const WorkspaceSidebarUserItem = ({user, variant, id}: WorkspaceSidebarUserItemProps) => {
    const workspaceId = useWorkspaceId()
    const avatarFallback = user.name?.charAt(0).toUpperCase()
    const {data: currentMember} = useCurrentMember({workspaceId})
    return (
        <Button className={cn(userItemVariants({variant}))} variant={"stone"} asChild>
            <Link href={`/workspace/${workspaceId}/member/${id}`}>
                {/*<Link href={currentMember?._id !== id ? `/workspace/${workspaceId}/member/${id}` : ""}>*/}
                <Avatar className={"size-6 rounded-md mr-1"}>
                    <AvatarImage autoSave={user._id} className={"rounded-md"} src={user.image}/>
                    <AvatarFallback className={"rounded-md bg-rose-300"}>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span
                    className={cn("text-sm truncate", currentMember?._id === id && "font-semibold text-red-500")}>{user.name}</span>
            </Link>
        </Button>
    )
}

export default WorkspaceSidebarUserItem