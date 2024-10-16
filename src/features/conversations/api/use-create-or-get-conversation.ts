import {useMutation} from "convex/react"
import {api} from "../../../../convex/_generated/api"
import {useCallback, useMemo, useState} from "react";
import {Id} from "../../../../convex/_generated/dataModel";

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
}

type RequestType = {
    workspaceId: Id<"workspaces">,
    toMemberId: Id<"members">,
}
type ResponseType = Id<"conversations"> | null

// 创建或获取已存在私聊对话 API hook
export const useCreateOrGetConversation = () => {
    const [data, setData] = useState<ResponseType>(null)
    const [error, setError] = useState<Error | null>(null)
    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null)

    const isPending = useMemo(() => status === "pending", [status])
    const isSuccess = useMemo(() => status === "success", [status])
    const isError = useMemo(() => status === "error", [status])
    const isSettled = useMemo(() => status === "settled", [status])

    const mutation = useMutation(api.conversations.createOrGet)
    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null)
            setError(null)
            setStatus("pending")

            const response = await mutation(values)
            options?.onSuccess?.(response)
            setData(response)
            setStatus("success")
        } catch (error) {
            options?.onError?.(error as Error)
            setError(error as Error)
            setStatus("error")
        } finally {
            options?.onSettled?.()
            setStatus("settled")
        }
    }, [mutation])

    return {
        mutate, data, error,
        isPending, isError, isSettled, isSuccess
    }
}