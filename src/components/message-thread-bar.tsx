import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface MessageToolbarProps {
    count: number;
    lastTime: string;
    lastImage?: string;
    onClick?: () => void;
}

export default function MessageThreadBar({
    count, lastTime, lastImage, onClick
}: MessageToolbarProps) {
    return (
        <button onClick={onClick}
                className={"flex items-center text-xs text-muted-foreground group hover:bg-white py-1 px-4 rounded-md"}>
            <Avatar className={"size-5 mr-2 "}>
                <AvatarImage src={lastImage}/>
                <AvatarFallback className={"bg-white text-blue-200 group-hover:bg-black group-hover:text-white"}>
                    {count}
                </AvatarFallback>
            </Avatar>
            <span className={"group-hover:underline"}>{count} 回复</span>
            {count > 0 &&
                <span className={"pl-2"}>
                    {lastTime}
                </span>
            }
        </button>)
}