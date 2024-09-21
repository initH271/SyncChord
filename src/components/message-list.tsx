import {GetMessagesReturnType} from "@/features/messages/api/use-get-messages";
import {differenceInMinutes, format, isToday, isYesterday} from "date-fns";
import Message from "./message";

interface MessageListProps {
    channelName?: string
    channelCreationTime?: number,
    data: GetMessagesReturnType | undefined,
    loadMore: () => void,
    isLoadingMore: boolean,
    canLoadMore: boolean,
    variant?: "channel",
}

const TIME_THRESHOLD = 3 // 消息间隔阈值

const formatDateLabel = (dateString: string) => {
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
                                        authorName={message.user.name}
                                        reactions={message.reactions}
                                        body={message.body}
                                        image={message.image}
                                        updatedAt={message.updateAt}
                                        createdAt={message._creationTime}
                                        threadCount={message.thread.count}
                                        threadImage={message.thread.image}
                                        threadTimestamp={message.thread.timestamp}

                                        isAuthor={false}
                                        isEditing={false}
                                        setEditingId={() => {}}
                                        isCompact={isCompact}
                                        hideThreadButton={false}
                                    />
                                )
                            })
                        }
                    </div>
                ))
            }
        </div>
    );
}