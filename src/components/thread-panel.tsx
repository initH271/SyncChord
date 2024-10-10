import {Button} from "@/components/ui/button";
import {AlertTriangle, Loader, Loader2, XIcon} from "lucide-react";
import {useGetMessage} from "@/features/messages/api/use-get-message";
import Message from "@/components/message";
import {Id} from "../../convex/_generated/dataModel";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useRef, useState} from "react";
import dynamic from "next/dynamic";
import {useGenerateUploadUrl} from "@/features/upload/api/use-generate-upload-url";
import {useCreateMessage} from "@/features/messages/api/use-create-message";
import Quill from "quill";
import {useChannelId} from "@/hooks/use-channel-id";
import {toast} from "sonner";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import {differenceInMinutes, format} from "date-fns";
import {formatDateLabel} from "@/components/message-list";

interface ThreadPanelProps {
    messageId: Id<"messages">;
    onCloseThread?: () => void;
}

const Editor = dynamic(() => import("@/components/editor"), {ssr: false});
const TIME_THRESHOLD = 3 // 消息间隔阈值

export default function ThreadPanel({messageId, onCloseThread}: ThreadPanelProps) {
    const {data: message, isLoading: loadingMessage} = useGetMessage({id: messageId});
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const {data: currentMember} = useCurrentMember({workspaceId})
    // 编辑器组件部分
    const [editingId, setEditingId] = useState("")
    const [editorKey, setEditorKey] = useState(0)
    const editorRef = useRef<Quill | null>(null)
    const {mutate: submitMessage, isPending: submittingMessage} = useCreateMessage()
    const {mutate: generateUploadUrl} = useGenerateUploadUrl()
    // 回复列表组件部分
    const {results, status, loadMore} = useGetMessages({channelId, parentMessageId: messageId})
    const canLoadMore = status === "CanLoadMore"
    const isLoadingMore = status === "LoadingMore"

    async function handleSubmit({body, image}: { body: string, image: File | null }) {

        try {
            editorRef.current?.enable(false)

            if (image) {
                // done: 上传消息图片
                // Step 1: Get a short-lived upload URL
                await generateUploadUrl({}, {
                    onSuccess: async (postUrl) => {
                        if (!postUrl) throw new Error("Url找不到");
                        // Step 2: POST the file to the URL
                        const result = await fetch(postUrl!, {
                            method: "POST",
                            headers: {"Content-Type": image!.type},
                            body: image,
                        });
                        if (!result.ok) throw new Error("图片上传失败");
                        const {storageId} = await result.json();
                        console.log("图片上传成功, id: ", storageId);
                        await submitMessage({
                            workspaceId,
                            channelId,
                            body,
                            image: storageId,
                            parentMessageId: messageId,
                        }, {
                            onSuccess: () => {
                                console.log("message submitted")
                            },
                            onError: () => {
                                console.error("message submitted invalid")
                            },
                        })
                    }
                });
            } else {
                await submitMessage({workspaceId, channelId, body, parentMessageId: messageId}, {
                    onSuccess: () => {
                        console.log("message submitted")
                    },
                    onError: () => {
                        console.error("message submitted invalid")
                    },
                })
            }

            toast.success("thread回复成功.")
        } catch (e) {
            toast.error("thread回复失败.")
        } finally {
            setEditorKey((k) => k + 1)
            editorRef.current?.enable(true)
        }
    }

    // 对消息按日期进行分组
    const groupedMessages = results!.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].unshift(message);
        return groups;
    }, {} as Record<string, typeof results>)
    if (loadingMessage || status === "LoadingFirstPage") {
        return (
            <div className={"flex h-full items-center justify-center"}>
                <Loader2 className={"animate-spin size-7 text-muted-foreground"}/>
            </div>
        )
    }

    return (
        <div className={"thread-panel h-full w-full flex-col flex bg-[#fdfcfa]"}>
            <div className={"thread-header h-[49px] flex justify-between items-center p-4 border-b"}>
                <p className={"text-lg font-bold"}>讨论</p>
                <Button variant={"ghost"} className={""} size={"icon_sm"} onClick={onCloseThread}>
                    <XIcon className={"size-5 stroke-2"}/>
                </Button>
            </div>
            {!message && (
                <div className={"flex h-full gap-x-2 items-center justify-center"}>
                    <AlertTriangle className={" size-7 text-muted-foreground"}/>
                    <p className={"text-muted-foreground text-sm"}>消息未找到</p>
                </div>
            )}

            {message && (
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
                                                hideThreadButton
                                            />
                                        )
                                    })
                                }
                            </div>
                        ))
                    }
                    <Message id={messageId}
                             hideThreadButton
                             memberId={message.memberId}
                             reactions={message.reactions}
                             body={message.body}
                             createdAt={message._creationTime}
                             isEditing={editingId === message._id}
                             setEditingId={setEditingId}
                             isAuthor={currentMember?._id === message.memberId}
                             authorImage={message.user.image}
                             authorName={message.user.name!}/>
                </div>
            )}
            <div className={"py-2 px-2"}>
                <Editor key={editorKey}
                        variant={"create"} disabled={submittingMessage}
                        placeholder={"回复他..."}
                        innerRef={editorRef} onSubmit={handleSubmit} onCancel={() => {console.log("canceled")}}/>
            </div>
        </div>
    )
}