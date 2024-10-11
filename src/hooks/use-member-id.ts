import {useParams} from "next/navigation"
import {Id} from "../../convex/_generated/dataModel"

// 获取路由参数memberId hook
export const useMemberId = () => {
    // 使用useParams hook获取动态路由参数
    const params = useParams<{ memberId: string }>()

    return params.memberId as Id<"members">
}