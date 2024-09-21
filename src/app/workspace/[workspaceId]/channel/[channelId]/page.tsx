"use client"

import {useChannelId} from "@/hooks/use-channel-id";
import {useGetChannel} from "@/features/channels/api/use-get-channel";
import LoadingPage from "@/components/loading-page";
import NoContentPage from "@/components/no-content-page";
import ChannelHeader from "@/app/workspace/[workspaceId]/channel/[channelId]/channel-header";
import {ChatInput} from "@/app/workspace/[workspaceId]/channel/[channelId]/chat-input";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import MessageList from "@/components/message-list";


export default function ChannelIdPage() {
    const channelId = useChannelId()
    const {data: channel, isLoading: channelLoading} = useGetChannel({channelId})
    const {results, status, loadMore} = useGetMessages({channelId})
    console.log("messages: ", results)
    if (channelLoading || status === "LoadingFirstPage") {
        return <LoadingPage/>
    }
    if (!channel) {
        return <NoContentPage content={"频道找不到"}/>
    }
    return (
        <div className={"h-full flex flex-col bg-white"}>
            <ChannelHeader title={channel.name}/>
            <MessageList
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput placeholder={`说些什么在 # ${channel.name}`}/>
        </div>
    )
}