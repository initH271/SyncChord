import dynamic from "next/dynamic";
import {useRef, useState} from "react";
import Quill from "quill";
import {useCreateMessage} from "@/features/messages/api/use-create-message";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useChannelId} from "@/hooks/use-channel-id";

// 动态载入以支持热重载
const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

export function ChatInput({placeholder}: { placeholder: string }) {
    const [editorKey, setEditorKey] = useState(0)
    const editorRef = useRef<Quill | null>(null)
    const {mutate: submitMessage, isPending: submittingMessage} = useCreateMessage()
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    async function handleSubmit({body, image}: { body: string, image: File | null }) {
        console.log(
            "submitted: ",
            {body, image}
        )
        // TODO: 上传消息图片
        await submitMessage({workspaceId, channelId, body}, {
            onSuccess: () => {
                console.log("message submitted")
            },
            onError: () => {
                console.error("message submitted invalid")
            },
        })

        setEditorKey((k) => k + 1)
    }

    return (
        <div className="flex flex-col p-2">
            <Editor key={editorKey}
                    variant={"create"} disabled={submittingMessage}
                    placeholder={placeholder}
                    innerRef={editorRef} onSubmit={handleSubmit} onCancel={() => {console.log("canceled")}}/>
        </div>
    )
}