"use client"
import {CreateWorkspaceModal} from "@/features/workspaces/components/create-workspace-modal"
import {useMounted} from "@/hooks/use-mounted"
import {CreateChannelModal} from "@/features/channels/components/create-channel-modal";

export const Modals = () => {

    const {mounted} = useMounted()
    if (!mounted) return null
    return (
        <>
            <CreateWorkspaceModal/>
            <CreateChannelModal/>
        </>
    )
}