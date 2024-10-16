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
    parentMessageId?: Id<"messages">,
    workspaceId: Id<"workspaces">,
    channelId?: Id<"channels">,
    conversationId?: string,
    body: string,
    image?: Id<"_storage">,
}
type ResponseType = Id<"messages"> | null

export const useCreateMessage = () => {
    const [data, setData] = useState<ResponseType>(null)
    const [error, setError] = useState<Error | null>(null)
    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null)

    const isPending = useMemo(() => status === "pending", [status])
    const isSuccess = useMemo(() => status === "success", [status])
    const isError = useMemo(() => status === "error", [status])
    const isSettled = useMemo(() => status === "settled", [status])

    const mutation = useMutation(api.messages.create)
    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null)
            setError(null)
            setStatus("pending")

            const response = await mutation({...values, conversationId: values.conversationId as Id<"conversations">})
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