import {Id} from "../../../../convex/_generated/dataModel"
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";

interface UseGetChannelProps {
    channelId: Id<"channels">,
}

// 获取channel hook
export const useGetChannel = ({channelId}: UseGetChannelProps) => {
    const data = useQuery(api.channels.getById, {channelId})
    const isLoading = data === undefined

    return {data, isLoading}
}