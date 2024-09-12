import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {CopyIcon, RefreshCcw} from "lucide-react";
import {toast} from "sonner";
import {useNewJoinCode} from "@/features/workspaces/api/use-new-join-code";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import useApproval from "@/hooks/use-confirm";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}


export const InviteModal = ({open, setOpen, name, joinCode}: InviteModalProps) => {
    const workspaceId = useWorkspaceId()
    const {mutate, isPending} = useNewJoinCode()
    const [ApprovalDialog, approval] = useApproval("要更新邀请码, 请点击确认?", "此操作将可能不可撤销!")

    async function handleNewCode() {
        const ok = await approval()
        if (!ok) return;
        await mutate({workspaceId}, {
            onSuccess: () => {
                toast.success("新邀请码生成完毕.")
            },
            onError: error => {
                toast.error("新邀请码生成失败.")
            }
        })
    }

    function handleCopy() {
        const inviteUrl = `${window.location.origin}/join/${workspaceId}?joinCode=${joinCode.toUpperCase()}`
        navigator.clipboard.writeText(inviteUrl).then(_ => toast.success("邀请链接复制成功."))
    }

    return (

        <>
            <ApprovalDialog/>
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
                        <Button onClick={handleCopy} variant={"ghost"} className={"my-2 text-xl font-semibold"}
                                size={"lg"}>
                            复制
                            <CopyIcon className={"size-5 ml-1"}/>
                        </Button>
                    </div>
                    <div className={"flex  justify-between items-center gap-y-2"}>

                        <Button variant={"outline"}
                                onClick={handleNewCode}>
                            生成新的邀请码
                            <RefreshCcw className={"size-4 ml-1"}/>
                        </Button>
                        <Button onClick={() => {setOpen(false)}} variant={"default"} className={"my-2"} size={"sm"}>
                            关闭
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}