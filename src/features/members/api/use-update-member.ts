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
    id: string,
    role: "admin" | "member",
}
type ResponseType = Id<"members"> | null

// API hook: 修改member role
export const useUpdateMember = () => {
    const [data, setData] = useState<ResponseType>(null)
    const [error, setError] = useState<Error | null>(null)
    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null)

    const isPending = useMemo(() => status === "pending", [status])
    const isSuccess = useMemo(() => status === "success", [status])
    const isError = useMemo(() => status === "error", [status])
    const isSettled = useMemo(() => status === "settled", [status])

    const mutation = useMutation(api.members.update)
    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null)
            setError(null)
            setStatus("pending")

            const response = await mutation({...values, id: values.id as Id<"members">})
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