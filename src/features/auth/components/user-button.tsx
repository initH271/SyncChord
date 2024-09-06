import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUser } from "../api/use-current-user"
import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"


export function UserButton() {
    const { data, isLoading } = useCurrentUser()
    const { signOut } = useAuthActions()
    const router = useRouter()
    if (isLoading) {
        return <Loader className="h-10 animate-spin text-muted-foreground" />
    }
    if (data == null) {
        return null
    }
    const { image, name } = data
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage src={image} />
                    <AvatarFallback className="bg-sky-400 text-white">
                        {name!.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-60">
                <DropdownMenuLabel>{name} 的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    signOut().finally(()=>router.push("/"))
                }}>
                    <LogOut className="mr-2 size-4" /> 退出登录
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}