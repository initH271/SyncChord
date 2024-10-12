import {useParentMessageId} from "@/features/messages/store/use-parent-message-id";
import {useProfileMemberId} from "@/features/members/store/use-profile-member-id";

// thread面板 hook
export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId()
    // 打开消息面板
    const onOpenMessage = async (message: string) => {
        await setParentMessageId(message)
        await setProfileMemberId(null)
    }

    const [profileMemberId, setProfileMemberId] = useProfileMemberId()
    // 打开成员信息页面板
    const onOpenProfile = async (profileId: string) => {
        await setProfileMemberId(profileId)
        await setParentMessageId(null)
    }

    // 关闭面板
    const onCloseMessage = async () => {
        await setParentMessageId(null)
    }
    const onCloseProfile = async () => {
        await setProfileMemberId(null)
    }
    return {
        parentMessageId,
        profileMemberId,
        onOpenMessage,
        onOpenProfile,
        onCloseMessage,
        onCloseProfile
    }
}