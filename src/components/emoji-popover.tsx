import React, {ReactNode, useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

// 导入表情组件
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EmojiPopoverProps {
    children: ReactNode;
    hint?: string;
    onEmojiSelect: (emoji: any) => void;
}


// 表情选择 弹窗组件
export default function EmojiPopover({children, hint = " 表情", onEmojiSelect}: EmojiPopoverProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    function onSelectEmoji(emoji: any) {
        onEmojiSelect(emoji)
        setPopoverOpen(false)
        setTimeout(() => {
            setTooltipOpen(false)
        }, 500)
    }

    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip delayDuration={50} open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>{children}</TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent
                        side={"top"}
                        align={"center"}
                        className="bg-black text-white border border-white/5">
                        <p className="font-medium text-xs">{hint}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent side={"top"} align={"center"} className="p-0 w-full border-none shadow-none">
                    <Picker data={data} onEmojiSelect={onSelectEmoji}/>
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    )
}