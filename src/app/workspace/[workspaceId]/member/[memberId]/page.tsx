"use client"
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useMemberId} from "@/hooks/use-member-id";
import {useCreateOrGetConversation} from "@/features/conversations/api/use-create-or-get-conversation";
import {useEffect} from "react";
import LoadingPage from "@/components/loading-page";
import NoContentPage from "@/components/no-content-page";
import Conversation from "@/app/workspace/[workspaceId]/member/[memberId]/conversation";


export default function MemberIdPage() {
    const workspaceId = useWorkspaceId()
    const memberId = useMemberId()
    const {data: currentConversationId, mutate: createOrGetConversation, isPending} = useCreateOrGetConversation()
    useEffect(() => {
        createOrGetConversation({workspaceId, toMemberId: memberId})
    }, [memberId, workspaceId, createOrGetConversation]);
    if (isPending) {
        return <LoadingPage/>
    }
    if (!currentConversationId) {
        return <NoContentPage content={"成员不存在"}/>
    }
    return (
        <Conversation conversationId={currentConversationId}/>
    )
}