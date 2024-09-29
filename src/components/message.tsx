import {ReactionsWithCount} from "../../convex/messages";
import dynamic from "next/dynamic";
import {format, isToday, isYesterday} from "date-fns";
import Hint from "@/components/hint";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Thumbnail from "@/components/thumbnail";
import MessageToolbar from "@/components/message-toolbar";

const BodyRenderer = dynamic(() => import("@/components/body-renderer"), {ssr: false})

interface MessageProps {
    id: string,
    memberId: string,
    authorImage?: string,
    authorName?: string,
    reactions: Array<Omit<ReactionsWithCount, "memberId">>,
    body: string,
    image?: string,
    createdAt: number,
    updatedAt?: number,
    threadCount: number,
    threadImage?: string,
    threadTimestamp?: number,
    isEditing: boolean,
    isAuthor: boolean,
    setEditingId?: (id: string) => void,
    isCompact?: boolean,
    hideThreadButton?: boolean
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "今天" : isYesterday(date) ? "昨天" : format(date, "yyyy-MM-d ")} ${format(date, "kk:mm:ss")}`
}

export default function Message({
    reactions, body, image, id,
    createdAt, authorImage, authorName,
    isCompact, isEditing, updatedAt, isAuthor, setEditingId, hideThreadButton,
}: MessageProps) {
    const createdDate = new Date(createdAt)


    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-[#f3f0ed] group relative">
                <div className="flex items-center gap-2">
                    <Hint side={"top"} align={"center"}
                          label={formatFullTime(createdDate)}>
                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px]
                    leading-[22px] text-center hover:underline
                ">
                            {format(createdDate, "hh:mm")}
                        </button>
                    </Hint>
                    <div className="flex flex-col w-full">
                        <BodyRenderer value={body}/>
                        <Thumbnail url={image}/>
                        {
                            updatedAt ? (
                                <span className="text-xs text-muted-foreground">(已编辑)</span>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-[#f3f0ed] group relative">
            <div className="flex items-start gap-2">
                <button className="text-xs text-muted-foreground w-[40px]
                    leading-[22px] text-center hover:underline">
                    <Avatar className="size-7  hover:opacity-75 transition rounded-md">
                        <AvatarImage src={authorImage} className={"rounded-md"}/>
                        <AvatarFallback className="rounded-md bg-sky-400 text-white text-xs">
                            {authorName!.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </button>
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="text-sm">
                        <button onClick={() => {}} className="font-bold text-primary hover:underline">
                            {authorName}
                        </button>
                        <span>&nbsp;&nbsp;</span>
                        <Hint side={"top"} align={"center"} label={formatFullTime(createdDate)}>
                            <button onClick={() => {}} className="text-xs text-primary hover:underline">
                                {format(createdDate, "kk:mm:ss")}
                            </button>
                        </Hint>
                    </div>
                    <BodyRenderer value={body}/>
                    <Thumbnail url={image}/>
                    {
                        updatedAt ? (
                            <span className="text-xs text-muted-foreground">(已编辑)</span>
                        ) : null
                    }
                </div>
            </div>
            {
                !isEditing && setEditingId && (
                    <MessageToolbar isAuthor={isAuthor} isPending={false}
                                    hideThreadButton={hideThreadButton}
                                    handleEdit={() => setEditingId(id)}
                                    handleThread={() => {}}
                                    handleDelete={() => {}}
                                    handleReaction={() => {}}/>

                )
            }
        </div>
    );
}


