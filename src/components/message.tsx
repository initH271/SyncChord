import {ReactionsWithCount} from "../../convex/messages";
import dynamic from "next/dynamic";
import {format, isToday, isYesterday} from "date-fns";
import Hint from "@/components/hint";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Thumbnail from "@/components/thumbnail";
import MessageToolbar from "@/components/message-toolbar";
import {useUpdateMessage} from "@/features/messages/api/use-update-message";
import {toast} from "sonner";
import {Id} from "../../convex/_generated/dataModel";
import {cn} from "@/lib/utils";
import {useRemoveMessage} from "@/features/messages/api/use-remove-message";
import useApproval from "@/hooks/use-confirm";
import {useToggleReaction} from "@/features/reactions/api/use-toggle-reaction";
import MessageReactions from "@/components/message-reactions";
import {usePanel} from "@/hooks/use-panel";

const BodyRenderer = dynamic(() => import("@/components/body-renderer"), {ssr: false})
const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

interface MessageProps {
    id: Id<"messages">,
    memberId: string,
    authorImage?: string,
    authorName: string,
    reactions: Array<Omit<ReactionsWithCount, "memberId">>,
    body: string,
    image?: string,
    createdAt: number,
    updatedAt?: number,
    threadCount?: number,
    threadImage?: string,
    threadTimestamp?: number,
    isEditing: boolean,
    isAuthor: boolean,
    setEditingId?: (id: string) => void,
    isCompact?: boolean,
    hideThreadButton?: boolean
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "今天" : isYesterday(date) ? "昨天" : format(date, "yyyy-MM-d ")} ${format(date, "kk:mm:ss")}`
}


export default function Message({
    reactions, body, image, id,
    createdAt, authorImage, authorName,
    isCompact, isEditing, updatedAt, isAuthor, setEditingId, hideThreadButton,
    threadCount, threadTimestamp
}: MessageProps) {
    const {onOpenMessage, onCloseMessage, parentMessageId} = usePanel()
    const [ApprovalDialog, approval] = useApproval("删除消息", "确定删除消息么? 该操作可能无法撤回.")
    const createdDate = new Date(createdAt)
    const {mutate: updateMessage, isPending: updatingMessage} = useUpdateMessage()
    const handleUpdate = async ({body}: { body: string }) => {
        await updateMessage({id, body}, {
            onSuccess: data => {
                toast.success("消息修改成功")
            },
            onError: error => {
                toast.error(`消息修改失败`)
            },
            onSettled: () => {
                setEditingId!("")
            }
        })
    }
    const {mutate: removeMessage, isPending: removingMessage} = useRemoveMessage()
    const handleDelete = async () => {
        const ok = await approval()
        if (!ok) return;
        await removeMessage({id}, {
            onSuccess: () => {
                toast.success("消息删除成功")
                // 关闭thread面板
                if (parentMessageId === id) onCloseMessage();
            },
            onError: error => {
                toast.error("消息删除失败")
            }
        })
    }
    const {mutate: toggleReaction, isPending: togglingReaction} = useToggleReaction()
    const handleReaction = async (value: string) => {
        await toggleReaction({messageId: id, value}, {
            onSuccess: data => {
                toast.success("reaction done")
            },
            onError: error => {
                toast.error("reaction failed")
            }
        })
    }
    const handleThread = () => {
        onOpenMessage(id)
    }
    return (
        <>
            <ApprovalDialog/>
            {/*紧凑布局*/}
            {isCompact && (
                <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-[#f3f0ed] group relative",
                    isEditing && "bg-[#f3f0ed]",
                    removingMessage && "bg-rose-300/30 transform transition-all scale-y-0 origin-bottom duration-200")}>
                    <div className="flex items-center gap-2">
                        <Hint side={"top"} align={"center"}
                              label={formatFullTime(createdDate)}>
                            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px]
                    leading-[22px] text-center hover:underline
                ">
                                {format(createdDate, "hh:mm")}
                            </button>
                        </Hint>
                        {isEditing ?
                            (<div className={"w-full h-full"}>
                                <Editor
                                    variant={"update"}
                                    onSubmit={handleUpdate}
                                    disabled={updatingMessage}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId!("")}
                                />
                            </div>) :
                            (<div className="flex flex-col w-full">
                                <BodyRenderer value={body}/>
                                <Thumbnail url={image}/>
                                {
                                    updatedAt ? (
                                        <span className="text-xs text-muted-foreground">(已编辑)</span>
                                    ) : null
                                }
                                <div className={"flex justify-between items-center"}>
                                    {reactions.length > 0 &&
                                        <MessageReactions reactions={reactions} onChange={handleReaction}/>
                                    }
                                    {!!threadCount && !hideThreadButton && (
                                        <span className={"text-xs text-muted-foreground"}>
                                        {threadCount} 回复
                                            {threadCount > 0 && (<span className={"pl-2"}>
                                            最后回复时间 {formatFullTime(new Date(threadTimestamp!))}
                                        </span>)}
                                    </span>)}
                                </div>
                            </div>)}
                    </div>
                    {
                        !isEditing && setEditingId && (
                            <MessageToolbar isAuthor={isAuthor} isPending={false}
                                            hideThreadButton={hideThreadButton}
                                            handleEdit={() => setEditingId(id)}
                                            handleThread={handleThread}
                                            handleDelete={handleDelete}
                                            handleReaction={handleReaction}/>

                        )
                    }
                </div>
            )}
            {/*常规布局*/}
            {!isCompact && (
                <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-[#f3f0ed] group relative",
                    isEditing && "bg-[#f3f0ed]",
                    // 动画: 右侧消失
                    removingMessage && "bg-rose-700/30 transform transition-all scale-x-0 origin-right duration-500")}>
                    <div className="flex items-start gap-2">
                        <button className="text-xs text-muted-foreground w-[40px]
                    leading-[22px] text-center hover:underline">
                            <Avatar className="size-7  hover:opacity-75 transition rounded-md">
                                <AvatarImage src={authorImage} className={"rounded-md"}/>
                                <AvatarFallback className="rounded-md bg-sky-400 text-white text-xs">
                                    {authorName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                        {isEditing ?
                            (<div className={"w-full h-full"}>
                                <Editor
                                    variant={"update"}
                                    onSubmit={handleUpdate}
                                    disabled={updatingMessage}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId!("")}
                                />
                            </div>) :
                            (<div className="flex flex-col w-full overflow-hidden">
                                <div className="text-sm">
                                    <button onClick={() => {}} className="font-bold text-primary hover:underline">
                                        {authorName}
                                    </button>
                                    <span>&nbsp;&nbsp;</span>
                                    <Hint side={"top"} align={"center"} label={formatFullTime(createdDate)}>
                                        <button onClick={() => {}} className="text-xs text-primary hover:underline">
                                            {format(createdDate, "kk:mm:ss")}
                                        </button>
                                    </Hint>
                                </div>
                                <BodyRenderer value={body}/>
                                <Thumbnail url={image}/>
                                {
                                    updatedAt ? (
                                        <span className="text-xs text-muted-foreground">(已编辑)</span>
                                    ) : null
                                }

                                <div className={"flex justify-between items-center"}>
                                    {reactions.length > 0 &&
                                        <MessageReactions reactions={reactions} onChange={handleReaction}/>
                                    }
                                    {!!threadCount && !hideThreadButton && (
                                        <span className={"text-xs text-muted-foreground"}>
                                        {threadCount} 回复
                                            {threadCount > 0 && (<span className={"pl-2"}>
                                            最后回复时间 {formatFullTime(new Date(threadTimestamp!))}
                                        </span>)}
                                    </span>)}
                                </div>
                            </div>)}
                    </div>
                    {
                        !isEditing && setEditingId && (
                            <MessageToolbar isAuthor={isAuthor} isPending={updatingMessage}
                                            hideThreadButton={hideThreadButton}
                                            handleEdit={() => setEditingId(id)}
                                            handleThread={handleThread}
                                            handleDelete={handleDelete}
                                            handleReaction={handleReaction}/>

                        )
                    }
                </div>
            )}
        </>
    );
}


