import {Button} from "@/components/ui/button";
import {Edit2Icon, MessageSquareTextIcon, Smile, Trash} from "lucide-react";
import Hint from "@/components/hint";
import EmojiPopover from "@/components/emoji-popover";

interface MessageToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    hideThreadButton?: boolean;
    handleDelete: () => void;
    handleEdit: () => void;
    handleReaction: () => void;
    handleThread: () => void;
}

// 消息工具栏组件
export default function MessageToolbar({
    isAuthor,
    isPending,
    hideThreadButton,
    handleDelete,
    handleEdit,
    handleReaction,
    handleThread,
}: MessageToolbarProps) {
    return (
        // 定位到父组件右上角
        <div className={"absolute top-0 right-2"}>
            {/*hover到消息组件时显示*/}
            <div
                className={"group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md  shadow-sm"}>
                <EmojiPopover onEmojiSelect={handleReaction} hint={"添加reaction"}>
                    <Button variant={"ghost"} size={"icon_sm"} disabled={isPending} className={""}
                            onClick={handleReaction}>
                        <Smile className={"size-4"}/>
                    </Button>
                </EmojiPopover>
                {!hideThreadButton &&
                    <Hint side={"top"} align={"center"} label={"回复该消息"}>
                        <Button variant={"ghost"} size={"icon_sm"} disabled={isPending} className={""}
                                onClick={handleThread}>
                            <MessageSquareTextIcon className={"size-4"}/>
                        </Button>
                    </Hint>
                }
                {isAuthor &&
                    <Hint side={"top"} align={"center"} label={"编辑"}>
                        <Button variant={"ghost"} size={"icon_sm"} disabled={isPending} className={""}
                                onClick={handleEdit}>
                            <Edit2Icon className={"size-4"}/>
                        </Button>
                    </Hint>
                }
                {isAuthor &&
                    <Hint side={"top"} align={"center"} label={"删除"}>
                        <Button variant={"ghost"} size={"icon_sm"} disabled={isPending} className={""}
                                onClick={handleDelete}>
                            <Trash className={"size-4"}/>
                        </Button>
                    </Hint>
                }

            </div>
        </div>
    )
}