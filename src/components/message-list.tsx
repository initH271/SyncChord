import {GetMessagesReturnType} from "@/features/messages/api/use-get-messages";
import {differenceInMinutes, format, isToday, isYesterday} from "date-fns";
import Message from "./message";
import ChannelIntro from "@/components/channel-intro";
import {useEffect, useRef, useState} from "react";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {Loader, Loader2} from "lucide-react";

interface MessageListProps {
    channelName?: string
    channelCreationTime?: number,
    data: GetMessagesReturnType | undefined,
    loadMore: () => void,
    isLoadingMore: boolean,
    canLoadMore: boolean,
    variant?: "channel" | "thread" | "conversation",
}

const TIME_THRESHOLD = 3 // 消息间隔阈值

export const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return "今天";
    if (isYesterday(date)) return "昨天";
    return format(date, "EEEE, MMMM d");
}


export default function MessageList({
    channelName,
    channelCreationTime,
    data,
    loadMore,
    isLoadingMore,
    canLoadMore,
    variant = "channel",
}: MessageListProps) {
    const [editingId, setEditingId] = useState("")

    const workspaceId = useWorkspaceId()
    const {data: currentMember, isLoading: loadingCurrentMember} = useCurrentMember({workspaceId})

    if (loadingCurrentMember) return null;

    // 对消息按日期进行分组
    const groupedMessages = data!.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].unshift(message);
        return groups;
    }, {} as Record<string, typeof data>)
    console.log("消息分组: ", groupedMessages)
    return (
        <div className="flex-1 flex flex-col-reverse pb-4 bg-[#fdfcfa]  msgl-message-scrollbar">
            {canLoadMore && (
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-10 right-10 border-t border-gray-300"/>
                    {isLoadingMore ? (<Loader className={"animate-spin"}/>) :
                        (<button
                            onClick={() => {loadMore()}}
                            className="relative inline-block bg-white rounded-full text-sm px-4 py-1 border border-gray-300 shadow-sm">
                            加载更多
                        </button>)
                    }
                </div>
            )}
            {
                Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className="text-center my-2 relative">
                            <hr className="absolute top-1/2 left-10 right-10 border-t border-gray-300"/>
                            <span
                                className="relative inline-block bg-white rounded-full text-sm px-4 py-1 border border-gray-300 shadow-sm">
                                {formatDateLabel(dateKey)}
                            </span>
                        </div>
                        {
                            messages?.map((message, index) => {
                                const prevMessage = messages[index - 1]
                                const isCompact = prevMessage && prevMessage.memberId === message.memberId && differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;
                                return (
                                    <Message
                                        key={message._id}
                                        id={message._id}
                                        memberId={message.memberId}
                                        authorImage={message.user.image}
                                        authorName={message.user.name!}
                                        reactions={message.reactions}
                                        body={message.body}
                                        image={message.image}
                                        updatedAt={message.updateAt}
                                        createdAt={message._creationTime}

                                        threadCount={message.thread.count}
                                        threadImage={message.thread.image}
                                        threadTimestamp={message.thread.timestamp}

                                        isAuthor={message.memberId === currentMember?._id}
                                        isEditing={editingId === message._id}
                                        setEditingId={setEditingId}
                                        isCompact={isCompact}
                                        hideThreadButton={variant === "thread"}
                                    />
                                )
                            })
                        }
                    </div>
                ))
            }
            {/*<LoadMoreMessage canLoadMore={canLoadMore} loadMore={loadMore}/>*/}
            {/*元素可见时加载更多*/}
            <div className="h-1" ref={(el) => {
                if (el) {
                    const observer = new IntersectionObserver(
                        ([entry]) => {
                            if (entry.isIntersecting && canLoadMore) loadMore();
                        },
                        {threshold: 1.0}
                    );
                    observer.observe(el);
                    return () => observer.disconnect();
                }
            }}/>
            {isLoadingMore && (
                <div className="text-center my-2 relative">
                    {/*<hr className="absolute top-1/2 left-10 right-10 border-t border-gray-300"/>*/}
                    <span
                        className="relative inline-block bg-transparent rounded-full text-sm px-4 py-1 shadow-sm">
                        <Loader2 className="animate-spin bg-transparent"/>
                    </span>
                </div>
            )}
            {
                variant === "channel" && channelName && channelCreationTime && (
                    <ChannelIntro name={channelName} creationTime={channelCreationTime}/>
                )
            }

        </div>
    );
}

// 加载更多消息组件
const LoadMoreMessage = ({canLoadMore, loadMore}: { canLoadMore: boolean, loadMore: () => void }) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const divRef = useRef(null);

    useEffect(() => {
        if (divRef.current) {
            observerRef.current = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && canLoadMore) {
                        loadMore();
                    }
                },
                {threshold: 1.0}
            );

            observerRef.current.observe(divRef.current);
        }

        // 在组件卸载时断开观察器
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [canLoadMore, loadMore]);

    return <div className="h-1" ref={divRef}/>;
};