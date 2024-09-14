import {Button} from "@/components/ui/button";
import {FaChevronDown} from "react-icons/fa";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog";
import {DialogTitle} from "@radix-ui/react-dialog";
import {TrashIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {FormEvent, useState} from "react";
import useApproval from "@/hooks/use-confirm";
import {useUpdateChannel} from "@/features/channels/api/use-update-channel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useChannelId} from "@/hooks/use-channel-id";
import {toast} from "sonner";
import {useRemoveChannel} from "@/features/channels/api/use-remove-channel";
import {useRouter} from "next/navigation";
import {useCurrentMember} from "@/features/members/api/use-current-member";

interface ChannelHeader {
    title: string;
}

export default function ChannelHeader({title}: ChannelHeader) {
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const router = useRouter()
    const [newName, setNewName] = useState("")
    const [ApprovalDialog, approval] = useApproval("确定进行此操作么?", "此操作将可能不可撤销!")
    const {mutate: updateChannel, isPending: updatingChannel} = useUpdateChannel()
    const {mutate: removeChannel, isPending: removingChannel} = useRemoveChannel()
    const {data: currentMember, isLoading} = useCurrentMember({workspaceId})
    const [editChannelInfo, setEditChannelInfo] = useState(false)

    function beforeEditChannel(open: boolean) {
        if (currentMember?.role !== "admin") return;
        setEditChannelInfo(open)
    }

    async function handleUpdateName(e: FormEvent) {
        e.preventDefault()
        await updateChannel({workspaceId, channelId, name: newName}, {
            onSuccess: () => {
                toast.success("频道名修改成功.")
                setNewName("")
            },
            onError: () => {
                toast.error(`频道名修改失败.`)

            },
        })
    }

    async function handleRemove() {
        const ok = await approval()
        if (!ok) return;
        await removeChannel({workspaceId, channelId}, {
            onSuccess: () => {
                toast.success("频道删除成功.")
                router.replace(`/workspace/${workspaceId}`)
            },
            onError: () => {
                toast.error(`频道删除失败.`)
            },
        })
    }

    return (
        <>
            <ApprovalDialog/>
            <div className={"flex bg-[#fdfcfa] h-[49px] border-b items-center px-4 overflow-hidden"}>
                <Dialog open={editChannelInfo} onOpenChange={beforeEditChannel}>
                    <DialogTrigger asChild>
                        <Button variant={"ghost"} className="text-lg font-semibold px-2 gap-x-2 overflow-hidden w-auto">
                            <span className="truncate"># {title}</span>
                            <FaChevronDown/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="p-4 border-b">
                            <DialogTitle># {title}</DialogTitle>
                            <DialogDescription className="text-sm pl-2">频道选项</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-y-2 px-4 pb-4">
                            <Dialog>
                                <div className="items-center gap-x-2 px-5  py-4
                            rounded-lg cursor-pointer hover:bg-gray-50 gap-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className=" font-semibold">频道名</p>
                                        <p className="text-xl"># {title}</p>
                                    </div>
                                    <DialogTrigger>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">修改</p>
                                    </DialogTrigger>
                                </div>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>重命名频道</DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>
                                    <form className="flex flex-col space-y-4" onSubmit={handleUpdateName}>
                                        <Input value={newName} disabled={updatingChannel}
                                               required autoFocus minLength={4} maxLength={80}
                                               placeholder={title}
                                               onChange={(e) => setNewName(e.target.value)}/>
                                        <DialogFooter className="">
                                            <DialogClose asChild>
                                                <Button variant={"outline"}>取消</Button>
                                            </DialogClose>
                                            <Button disabled={updatingChannel} type={"submit"}>确认</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button variant={"link"}
                                    onClick={handleRemove}
                                    disabled={removingChannel}
                                    className="flex items-center justify-start gap-x-2 px-5  py-4 rounded-md cursor-pointer hover:bg-[#f0eeeb] text-rose-600 hover:no-underline">
                                <TrashIcon className="size-4"/>
                                <p className="text-sm font-semibold">
                                    删除频道
                                </p>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </>

    )
}