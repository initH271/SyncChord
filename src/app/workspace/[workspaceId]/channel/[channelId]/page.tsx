"use client"

import {useChannelId} from "@/hooks/use-channel-id";
import {useGetChannel} from "@/features/channels/api/use-get-channel";
import LoadingPage from "@/components/loading-page";
import NoContentPage from "@/components/no-content-page";
import ChannelHeader from "@/app/workspace/[workspaceId]/channel/[channelId]/channel-header";
import {ChatInput} from "@/app/workspace/[workspaceId]/channel/[channelId]/chat-input";

export default function ChannelIdPage() {
    const channelId = useChannelId()
    const {data: channel, isLoading: channelLoading} = useGetChannel({channelId})

    if (channelLoading) {
        return <LoadingPage/>
    }
    if (!channel) {
        return <NoContentPage content={"频道找不到"}/>
    }
    return (
        <div className={"h-full flex flex-col"}>
            <ChannelHeader title={channel.name}/>
            <div className="flex-1"></div>
            <ChatInput placeholder={`说些什么在 # ${channel.name}`}/>
        </div>
    )
}