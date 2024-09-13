import {useParams} from "next/navigation"
import {Id} from "../../convex/_generated/dataModel"

// 获取路由参数workspaceId hook
export const useChannelId = () => {
    // 使用useParams hook获取动态路由参数
    const params = useParams<{ channelId: string }>()

    return params.channelId as Id<"channels">
}