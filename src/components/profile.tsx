import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";

interface ProfileProps {
    memberId: string;
    onClose: () => void;
}


export default function Profile({memberId, onClose}: ProfileProps) {
    return (
        <div className={"thread-panel h-full w-full flex-col flex bg-[#fdfcfa]"}>
            <div className={"thread-header h-[49px] flex justify-between items-center p-4 border-b"}>
                <p className={"text-lg font-bold"}>Profile</p>
                <Button variant={"ghost"} className={""} size={"icon_sm"} onClick={onClose}>
                    <XIcon className={"size-5 stroke-2"}/>
                </Button>
            </div>
            <div>
                profile {memberId}
            </div>
        </div>
    )
}