import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {CopyIcon} from "lucide-react";
import {toast} from "sonner";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}


export const InviteModal = ({open, setOpen, name, joinCode}: InviteModalProps) => {

    function handleCopy() {
        const inviteUrl = `${window.location.origin}/join/${joinCode.toUpperCase()}`
        navigator.clipboard.writeText(inviteUrl).then(_ => toast.success("邀请链接复制成功."))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> 邀请新成员加入 {name}</DialogTitle>
                    <DialogDescription>复制下面的邀请码并给新成员</DialogDescription>
                </DialogHeader>
                <div className={"h-full flex flex-col items-center gap-y-2"}>
                    <p className={"text-3xl font-bold text-orange-500 tracking-widest"}>
                        {joinCode.toUpperCase()}
                    </p>
                    <Button onClick={handleCopy} variant={"default"} className={"my-2"} size={"sm"}>
                        复制
                        <CopyIcon className={"size-4 ml-1"}/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}