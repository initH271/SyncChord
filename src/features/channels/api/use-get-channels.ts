import {Id} from "../../../../convex/_generated/dataModel"
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";

interface UseGetChannelsProps {
    workspaceId: Id<"workspaces">
}

// 获取workspace下所有channel hook
export const useGetChannels = ({workspaceId}: UseGetChannelsProps) => {
    const data = useQuery(api.channels.get, {workspaceId})
    const isLoading = data === undefined

    return {data, isLoading}
}