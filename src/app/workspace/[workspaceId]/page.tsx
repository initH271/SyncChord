"use client"
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace"
import {useWorkspaceId} from "@/hooks/use-workspace-id"
import LoadingPage from "@/components/loading-page";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import {useEffect, useMemo} from "react";
import {useRouter} from "next/navigation";
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";

interface WorkspaceIdPageProps {

}

export default function WorkSpaceIdPage({}: WorkspaceIdPageProps) {
    const workspaceId = useWorkspaceId()
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId})
    const [_, setOpen] = useCreateChannelModal()

    const firstChannelId = useMemo(() => channels?.[0]?._id, [channels])
    const router = useRouter()
    useEffect(() => {

        if (workspaceLoading || channelsLoading || !workspace) return;

        if (firstChannelId) router.replace(`/workspace/${workspaceId}/channel/${firstChannelId}`);
        else setOpen(true);
    }, [firstChannelId, router, workspaceId, workspaceLoading, channelsLoading, workspace, setOpen])

    return (
        <LoadingPage/>
    )
}