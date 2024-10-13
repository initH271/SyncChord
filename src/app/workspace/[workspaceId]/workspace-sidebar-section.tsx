import {Button} from "@/components/ui/button";
import React from "react";
import {FaCaretDown} from "react-icons/fa";
import Hint from "@/components/hint";
import {PlusIcon} from "lucide-react";
import {useToggle} from "react-use";
import {cn} from "@/lib/utils";

interface WorkspaceSectionProps {
    children: React.ReactNode
    label: string
    hint: string
    onNew?: () => void
}

export default function WorkspaceSidebarSection({
    children, label, hint, onNew
}: WorkspaceSectionProps) {
    const [channelOn, toggle] = useToggle(true)

    return (<>
        <div className={"flex flex-col px-2 pb-2 gap-y-0.5 w-full border border-x-0 border-b-0 rounded-md"}>
            <div className={"flex items-center pr-3.5 group"}>
                <Button variant={"stone"} className={"p-0.5 text-sm shrink-0 size-6"}
                        onClick={toggle}>
                    <FaCaretDown className={cn("size-4 transition-transform", channelOn || "-rotate-90")}/>
                </Button>
                <Button variant={"stone"} size={"sm"}
                        onClick={toggle}
                        className={"flex-1 group px-1.5 text-sm justify-start overflow-hidden"}>
                    <span className={"truncate"}>{label}</span>
                </Button>
                {
                    onNew && (
                        <Hint side={"top"} align={"center"} label={hint}>
                            <Button onClick={onNew} variant={"stone"} size={"icon"}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm
                            size-6 shrink-0">
                                <PlusIcon/>
                            </Button>
                        </Hint>
                    )
                }
            </div>
            {channelOn && children}
        </div>
    </>)
}