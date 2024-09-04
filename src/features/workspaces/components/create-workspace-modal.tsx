
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateWorkspace } from "../api/use-create-workspace"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal()
    const [name, setName] = useState("")
    const router = useRouter()
    const { mutate, isPending } = useCreateWorkspace()
    function handleClose() {
        setOpen(false)
        setName("")
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = await mutate({ name }, {
            onSuccess(workspaceId) {
                toast.success("工作空间创建成功!")
                router.push(`/workspace/${workspaceId}`)
                setOpen(false)

            },
            onError(error) {
                console.error("创建workspace: ", error);
            },
            onSettled() {
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>创建工作空间</DialogTitle>
                    <DialogDescription>
                        为你或你的团队创建一个崭新的私有空间.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit} >
                    <Input id="name" name="name" disabled={isPending} onChange={(e) => { setName(e.target.value) }} placeholder="工作空间名称, 如'开发2组','产品1组'" minLength={3} />

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>创建</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}