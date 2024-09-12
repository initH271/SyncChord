import {ReactNode} from "react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "./ui/tooltip";

interface HintProps {
    children: ReactNode;
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
    label: string;
}

export default function Hint({children, side, align, label}: HintProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}
                                className="bg-black text-white border border-white/5">
                    <p className="font-medium text-xs">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}