import dynamic from "next/dynamic";
import {useRef, useState} from "react";
import Quill from "quill";
import {useCreateMessage} from "@/features/messages/api/use-create-message";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useChannelId} from "@/hooks/use-channel-id";
import {useGenerateUploadUrl} from "@/features/upload/api/use-generate-upload-url";
import {toast} from "sonner";

// 动态载入以支持热重载
const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

interface ChatInputProps {
    placeholder: string;
    conversationId: string;
}

export function ChatInput({placeholder, conversationId}: ChatInputProps) {
    const [editorKey, setEditorKey] = useState(0)
    const editorRef = useRef<Quill | null>(null)
    const {mutate: submitMessage, isPending: submittingMessage} = useCreateMessage()
    const {mutate: generateUploadUrl} = useGenerateUploadUrl()
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    async function handleSubmit({body, image}: { body: string, image: File | null }) {
        console.log(
            "submitted: ",
            {body, image}
        )
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
                            conversationId,
                            body,
                            image: storageId
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
                await submitMessage({workspaceId, conversationId, body}, {
                    onSuccess: () => {
                        console.log("message submitted")
                    },
                    onError: () => {
                        console.error("message submitted invalid")
                    },
                })
            }

            toast.success("消息发送成功.")
        } catch (e) {
            toast.error("消息发送  失败.")
        } finally {
            setEditorKey((k) => k + 1)
            editorRef.current?.enable(true)
        }
    }

    return (
        <div className="flex flex-col">
            <Editor key={editorKey}
                    variant={"create"} disabled={submittingMessage}
                    placeholder={placeholder}
                    innerRef={editorRef} onSubmit={handleSubmit} onCancel={() => {console.log("canceled")}}/>
        </div>
    )
}