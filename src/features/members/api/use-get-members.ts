import {useQuery} from "convex/react"
import {api} from "../../../../convex/_generated/api"
import {Id} from "../../../../convex/_generated/dataModel"

interface useGetMembersProps {
    workspaceId: Id<"workspaces">
}

// 获取workspace下所有member hook
export const useGetMembers = ({workspaceId}: useGetMembersProps) => {
    const data = useQuery(api.members.get, {workspaceId})
    const isLoading = data === undefined

    return {
        data, isLoading
    }
}