import {usePaginatedQuery} from "convex/react"
import {api} from "../../../../convex/_generated/api"
import {Id} from "../../../../convex/_generated/dataModel";

interface useGetMessageProps {
    parentMessageId?: Id<"messages">,
    channelId?: Id<"channels">,
    conversationId?: Id<"conversations">,
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"]

const BATCH_SIZE = 20;

export const useGetMessages = ({
    parentMessageId,
    channelId,
    conversationId,
}: useGetMessageProps) => {
    const {results, status, loadMore} = usePaginatedQuery(api.messages.get, {
        parentMessageId,
        channelId,
        conversationId
    }, {initialNumItems: BATCH_SIZE})

    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE),
    }
}