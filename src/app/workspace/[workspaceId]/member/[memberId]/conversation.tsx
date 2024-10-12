import {useMemberId} from "@/hooks/use-member-id";
import {useGetMember} from "@/features/members/api/use-get-member";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {Id} from "../../../../../../convex/_generated/dataModel";
import LoadingPage from "@/components/loading-page";
import MemberHeader from "@/app/workspace/[workspaceId]/member/[memberId]/member-header";
import {ChatInput} from "@/app/workspace/[workspaceId]/member/[memberId]/chat-input";
import MessageList from "@/components/message-list";
import {usePanel} from "@/hooks/use-panel";

interface ConversationProps {
    conversationId: string;
}


export default function Conversation({conversationId}: ConversationProps) {
    const toMemberId = useMemberId()
    const workspaceId = useWorkspaceId()
    const {data: toMember, isLoading: toMemberLoading} = useGetMember({memberId: toMemberId})
    const {
        results: messages,
        status,
        loadMore
    } = useGetMessages({conversationId: conversationId as Id<"conversations">})
    const {onOpenProfile} = usePanel()
    const openProfilePanel = () => {
        onOpenProfile(toMember!._id)
    }

    if (toMemberLoading || status === "LoadingFirstPage" || !toMember) {
        return <LoadingPage/>
    }
    return (
        <div className={"h-full flex flex-col bg-white"}>
            <MemberHeader memberName={toMember.user.name!} memberImage={toMember.user.image}
                          onClick={openProfilePanel}/>
            <MessageList variant={"conversation"}
                         memberImage={toMember.user.image} memberName={toMember.user.name}
                         loadMore={loadMore} canLoadMore={status === "CanLoadMore"}
                         data={messages} isLoadingMore={status === "LoadingMore"}/>
            <ChatInput placeholder={"对他说点什么吧..."} conversationId={conversationId}/>
        </div>
    )
}