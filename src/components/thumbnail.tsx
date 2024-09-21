import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

interface ThumbnailProps {
    url?: string;
}

// 缩略图组件
export default function Thumbnail({url}: ThumbnailProps) {
    if (!url) return null;
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative overflow-hidden max-w-[120px] border rounded-lg my-2 cursor-zoom-in">
                    <img src={url} alt="消息图片" className="rounded-md object-cover size-full"/>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-screen-md border-none bg-transparent p-0 shadow-none">
                <DialogHeader>
                    <DialogTitle/>
                    <DialogDescription/>
                </DialogHeader>
                <img src={url} alt="消息图片" className="rounded-md object-cover size-full"/>
            </DialogContent>
        </Dialog>
    )
}