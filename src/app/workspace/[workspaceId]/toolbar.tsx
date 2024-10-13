"use client"
import LoadingProgress from "@/components/loading-progress"
import {Button} from "@/components/ui/button"
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace"
import {useWorkspaceId} from "@/hooks/use-workspace-id"
import {Info, Search} from "lucide-react"
import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import {usePanel} from "@/hooks/use-panel";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command"
import {MdPerson} from "react-icons/md";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import {useGetMembers} from "@/features/members/api/use-get-members";
import Link from "next/link"
import {useChannelId} from "@/hooks/use-channel-id";

export const Toolbar = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const {data, isLoading} = useGetWorkspace({id: workspaceId})
    const channelId = useChannelId()
    const {onOpenProfile} = usePanel()
    const {data: currentMember, isLoading: loadingCurrentMember} = useCurrentMember({workspaceId})
    const [openCommand, setOpenCommand] = useState(false)
    const {data: channels, isLoading: loadingChannels} = useGetChannels({workspaceId})
    const {data: members, isLoading: loadingMembers} = useGetMembers({workspaceId})
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpenCommand((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])
    useEffect(() => {
        if (!isLoading && data === null) {
            router.push("/")
        }
    }, [data, router, isLoading])

    if (isLoading || loadingCurrentMember || loadingMembers || loadingChannels) {
        return (
            <div
                className="bg-[#fdfcfa] flex items-center justify-center h-10 p-1.5 border-solid border-b-[1px] border-[#e5e7eb]">
                {/* <Loader2 className="size-8 text-black animate-spin" /> */}
                <LoadingProgress className="w-[80%] h-1"/>
            </div>
        )
    }


    return (
        <>
            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="输入命令或者搜索...."/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="建议">
                        <CommandItem>
                            <MdPerson className="mr-2 h-4 w-4"/>
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="频道">
                        {channels?.map((channel) => (
                            <CommandItem
                                key={channel._id} asChild>
                                <Link onClick={() => setOpenCommand(false)}
                                      href={`/workspace/${workspaceId}/channel/${channel._id}`}>
                                    <span># {channel.name}</span>
                                </Link>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="成员">
                        {members?.map((member) => (
                            <CommandItem
                                key={member._id} asChild>
                                <Link
                                    className={"flex"}
                                    onClick={() => setOpenCommand(false)}
                                    href={`/workspace/${workspaceId}/channel/${channelId}?profileMemberId=${member._id}`}>
                                    <MdPerson className="mr-2 h-4 w-4"/>
                                    <span>{member.user.name}</span>
                                </Link>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            <nav
                className="bg-[#fdfcfa] flex items-center justify-center h-10 p-1.5 border-solid border-b-[1px] border-[#e5e7eb]">
                <div className="flex-1">

                </div>
                <div className="min-w-[280px] max-w-[682px] grow-[2] shrink">
                    <Button
                        onClick={() => setOpenCommand(true)}
                        className="bg-transparent hover:bg-[#f0eeeb] w-full justify-start h-7 px-2 border-[1px] border-black"
                        size={"sm"}>
                        <Search className="size-4 text-black mr-2 "/>
                        <span className="text-black/100 text-xs">
                        在 {data?.name} 中搜索, 或使用快捷键CTRL+K
                    </span>
                    </Button>
                </div>
                <div className="ml-auto flex-1 flex items-center justify-end">
                    <Button className="bg-transparent hover:bg-[#f0eeeb] text-accent" size={"sm"} variant={"ghost"}
                            onClick={() => onOpenProfile(currentMember!._id)}>
                        <Info className="size-5 text-black font-semibold"/>
                    </Button>
                </div>
            </nav>
        </>
    )
}