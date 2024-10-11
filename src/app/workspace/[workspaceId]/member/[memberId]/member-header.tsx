import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FaChevronDown} from "react-icons/fa";

interface MemberHeaderProps {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
}

export default function MemberHeader({memberName = "成员", memberImage, onClick}: MemberHeaderProps) {


    return (
        <>
            <div className={"flex bg-[#fdfcfa] h-[49px] border-b items-center px-4 py-2 overflow-hidden"}>
                <Button variant={"ghost"} onClick={onClick}
                        className="text-lg font-semibold px-2 gap-x-2 overflow-hidden w-auto">
                    <Avatar className={" mr-2"}>
                        <AvatarImage src={memberImage}/>
                        <AvatarFallback>
                            {memberName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{memberName}</span>
                    <FaChevronDown className={"size-4"}/>
                </Button>
            </div>
        </>

    )
}