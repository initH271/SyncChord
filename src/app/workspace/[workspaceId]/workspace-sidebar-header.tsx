import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

interface WorkSpaceSidebarHeaderProps {
    workspace: Doc<"workspaces">;
    isAdmin: boolean;
}
export default function WorkSpaceSidebarHeader({ workspace, isAdmin }: WorkSpaceSidebarHeaderProps) {
    return (
        <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={"sm"} className="
                    bg-transparent text-black hover:bg-[#f0eeeb]
                    font-semibold text-lg w-auto p-1.5 overflow-hidden">
                        <span>
                            {workspace.name}
                        </span>
                        <ChevronDown className="size-4 ml-1 shrink-0" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="w-64" >
                    <DropdownMenuLabel className="cursor-pointer capitalize">
                        <div className="flex flex-col items-start">
                            <p className="font-bold">
                                {workspace.name}
                            </p>
                            <p className="text-xs text-muted-foreground">当前活动空间</p>

                        </div>
                    </DropdownMenuLabel>
                    {
                        isAdmin && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer capitalize hover:bg-[#f0eeeb]">
                                    <div className="flex items-center gap-1">
                                        <i>邀请成员加入 {workspace.name}</i>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer capitalize hover:bg-[#f0eeeb]">
                                    <div className="flex items-center gap-1">
                                        选项
                                    </div>
                                </DropdownMenuItem>
                            </>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-0.5">
                <Hint side="bottom" align="center" label="筛选对话">
                    <Button variant="ghost" size={"icon"} className="text-black hover:bg-[#f0eeeb]">
                        <ListFilter className="size-4" />
                    </Button>
                </Hint>
                <Hint side="bottom" align="center" label="发起新对话">
                    <Button variant="ghost" size={"icon"} className="text-black hover:bg-[#f0eeeb]">
                        <SquarePen className="size-4" />
                    </Button>
                </Hint>
            </div>
        </div>
    )
}