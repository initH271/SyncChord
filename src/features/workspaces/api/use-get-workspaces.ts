import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

// 获取所有workspace hook
export const UseGetWorkspaces = () => {
    const data = useQuery(api.workspaces.get)
    const isLoading = data === undefined
    return { data, isLoading }
}