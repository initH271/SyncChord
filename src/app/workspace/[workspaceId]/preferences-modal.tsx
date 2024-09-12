import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import useApproval from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";


interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

export default function PreferencesModal({ open, setOpen, initialValue }: PreferencesModalProps) {
    const router = useRouter()
    const [value, setValue] = useState(initialValue)
    const [newName, setNewName] = useState(initialValue)
    const [editOpen, setEditOpen] = useState(false)
    const workspaceId = useWorkspaceId()
    const { mutate: updateWorkspace, isPending: UpdatingWorkspace } = useUpdateWorkspace()
    const { mutate: removeWorkspace, isPending: removingWorkspace } = useRemoveWorkspace()
    const [ApprovalDialog, approval] = useApproval("确定进行此操作么?", "此操作将可能不可撤销!")
    async function handleEdit(e: FormEvent) {
        e.preventDefault()
        const ok = await approval()
        if (!ok) return;
        await updateWorkspace({ id: workspaceId, name: newName }, {
            onSuccess() {
                toast.success("修改成功")
                setValue(newName)
                setEditOpen(false)
            },
            onError() {
                toast.error("修改失败")
            }
        })
    }
    async function handleRemove() {
        const ok = await approval()
        if (!ok) return;
        await removeWorkspace({ id: workspaceId }, {
            onSuccess() {
                toast.success("删除成功")
                router.replace("/")
            },
            onError() {
                toast.error("删除失败")
            }
        })
    }
    return (
        <>
            <ApprovalDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0">
                    <DialogHeader className="border-b p-4">
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                        <DialogDescription>
                            选项
                        </DialogDescription>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        {/* 具体选项 */}
                        <div className="px-5 py-4 rounded-lg border cursor-pointer hover:bg-gray-50" >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold"> 工作空间名称</p>
                                <p className="text-xm">{value}</p>
                            </div>
                            <div className="flex items-center justify-start">
                                <Dialog open={editOpen} onOpenChange={setEditOpen} >
                                    <DialogTrigger>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">编辑</p>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>重命名</DialogTitle>
                                            <DialogDescription></DialogDescription>
                                        </DialogHeader>
                                        <form className="space-y-4" onSubmit={handleEdit} >
                                            <Input value={newName} disabled={UpdatingWorkspace}
                                                minLength={4} maxLength={80}
                                                onChange={(e) => setNewName(e.target.value)} placeholder="新的工作空间名称" />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button disabled={UpdatingWorkspace} className="" variant={"outline"}>
                                                        取消
                                                    </Button>
                                                </DialogClose>
                                                <Button disabled={UpdatingWorkspace} type="submit" className="" variant={"default"}>
                                                    确认
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <button disabled={removingWorkspace} onClick={handleRemove} className="flex items-center justify-end gap-x-2 px-5 py-4 rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600">
                            <TrashIcon className="size-5" />
                            <p className="text-sl font-semibold">删除工作空间</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}