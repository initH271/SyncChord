import {useParentMessageId} from "@/features/messages/store/use-parent-message-id";

// thread面板 hook
export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId()

    // 带上消息参数
    const onOpenMessage = (message: string) => {
        setParentMessageId(message)
    }
    const onCloseMessage = () => {
        setParentMessageId(null)
    }

    return {
        parentMessageId,
        onOpenMessage,
        onCloseMessage,
    }
}