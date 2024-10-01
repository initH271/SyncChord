import {Button} from "@/components/ui/button";
import {AlertTriangle, Loader2, XIcon} from "lucide-react";
import {useGetMessage} from "@/features/messages/api/use-get-message";
import Message from "@/components/message";
import {Id} from "../../convex/_generated/dataModel";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useState} from "react";

interface ThreadPanelProps {
    messageId: Id<"messages">;
    onCloseThread?: () => void;
}

export default function ThreadPanel({messageId, onCloseThread}: ThreadPanelProps) {
    const {data: message, isLoading: loadingMessage} = useGetMessage({id: messageId});
    const workspaceId = useWorkspaceId()
    const {data: currentMember} = useCurrentMember({workspaceId})
    const [editingId, setEditingId] = useState("")

    if (loadingMessage) {
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
                <div className={"h-full w-full flex flex-col"}>
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
        </div>
    )
}