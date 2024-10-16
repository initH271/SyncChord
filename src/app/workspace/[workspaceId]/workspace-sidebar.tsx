import {useCurrentMember} from "@/features/members/api/use-current-member"
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace"
import {useWorkspaceId} from "@/hooks/use-workspace-id"
import {HashIcon, Loader2, TriangleAlert} from "lucide-react"
import WorkSpaceSidebarHeader from "./workspace-sidebar-header"
import WorkspaceSidebarItem from "@/app/workspace/[workspaceId]/workspace-sidebar-item";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import WorkspaceSidebarSection from "@/app/workspace/[workspaceId]/workspace-sidebar-section";
import {useGetMembers} from "@/features/members/api/use-get-members";
import WorkspaceSidebarUserItem from "@/app/workspace/[workspaceId]/workspace-sidebar-user-item";
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {useChannelId} from "@/hooks/use-channel-id";
import {useMemberId} from "@/hooks/use-member-id";

export default function WorkSpaceSidebar() {
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const {data: currentMember, isLoading: memberLoading} = useCurrentMember({workspaceId})
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId})
    const {data: members, isLoading: membersLoading} = useGetMembers({workspaceId})
    const toMemberId = useMemberId()
    const [_open, setOpen] = useCreateChannelModal()
    if (workspaceLoading || memberLoading || channelsLoading || membersLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="size-10 animate-spin"/>
                {/* <LoadingProgress className="w-[80%]" /> */}
            </div>
        )
    }
    if (!workspace || !currentMember) {

        return (
            <div className="flex  gap-x-2 items-center justify-center h-full">
                <TriangleAlert className="size-5"/>
                <p className="text-sm">
                    未找到工作空间!
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <WorkSpaceSidebarHeader workspace={workspace} isAdmin={currentMember.role == "admin"}/>
            <WorkspaceSidebarSection key={"allChannels"} label={"所有频道"} hint={"新建频道"}
                                     onNew={currentMember.role === "admin" ? () => {setOpen(true)} : undefined}>
                {
                    channels?.map((ch) => (
                        <WorkspaceSidebarItem key={ch._id} label={ch.name} id={ch._id} icon={HashIcon}
                                              variant={channelId === ch._id ? "active" : "default"}/>
                    ))
                }
            </WorkspaceSidebarSection>
            <WorkspaceSidebarSection key={"allMembers"} label={"所有成员"} hint={"添加成员"}>
                {
                    members?.map((member) => (
                        <WorkspaceSidebarUserItem key={member._id} id={member._id} user={member.user}
                                                  variant={member._id === toMemberId ? "active" : "default"}/>
                    ))
                }
            </WorkspaceSidebarSection>
        </div>
    )
}

