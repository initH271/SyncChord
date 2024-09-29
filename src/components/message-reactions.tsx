import {ReactionsWithCount} from "../../convex/messages";
import {cn} from "@/lib/utils";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import Hint from "@/components/hint";
import EmojiPopover from "@/components/emoji-popover";
import {MdOutlineAddReaction} from "react-icons/md";

interface MessageReactionsProps {
    reactions: Array<Omit<ReactionsWithCount, "memberId">>,
    onChange: (value: string) => void,
}

export default function MessageReactions({
    reactions,
    onChange,
}: MessageReactionsProps) {
    const workspaceId = useWorkspaceId()
    const {data: currentMember} = useCurrentMember({workspaceId})
    return (
        <div className={"flex gap-1 mt-1 mb-1"}>
            {reactions.length > 0 && reactions.map((reaction, index) => (
                <div key={reaction._id}>
                    <Hint side={"top"} align={"center"}
                          label={reaction.memberIds.includes(currentMember!._id) ? "-1" : "+1"}>
                        <button
                            onClick={() => onChange(reaction.value)}
                            className={cn("h-6 px-2 rounded-full border border-transparent flex items-center gap-x-1 bg-[#b1d5c8]/40 hover:bg-[#b1d5c8]",
                                reaction.memberIds.includes(currentMember!._id) && "bg-[#99bcac] border-[#99bcac]")}>
                            {reaction.value}
                            <span
                                className={cn("text-xs font-semibold text-muted-foreground",
                                    reaction.memberIds.includes(currentMember!._id) && "text-blue")}>
                        {reaction.count}
                        </span>
                        </button>
                    </Hint>
                </div>
            ))}
            <EmojiPopover onEmojiSelect={(emoji) => onChange(emoji.native)} hint={"新的反应"}>
                <button
                    className={"h-6 px-2 rounded-full border border-transparent hover:border-[#99bcac]"}>
                    <MdOutlineAddReaction/>
                </button>
            </EmojiPopover>
        </div>
    )
}