import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useRouter} from "next/navigation"
import {ChangeEvent, FormEvent, useState} from "react"
import {toast} from "sonner"
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {useCreateChannel} from "@/features/channels/api/use-create-channel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";

export const CreateChannelModal = () => {
    const [open, setOpen] = useCreateChannelModal()
    const [name, setName] = useState("")
    const router = useRouter()
    const {mutate, isPending} = useCreateChannel()
    const workspaceId = useWorkspaceId()

    function handleClose() {
        setName("")
        setOpen(false)
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await mutate({name, workspaceId}, {
            onSuccess(chId) {
                toast.success("频道创建成功!")
                router.push(`/workspace/${workspaceId}/channel/${chId}`)
                setOpen(false)
            },
            onError(error) {
                console.error("创建channel失败: ", error);
            },
            onSettled() {
            }
        })
    }

    function validateName(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\s+/g, "-");
        setName(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>创建新的频道</DialogTitle>
                    <DialogDescription>
                        为工作空间创建一个新的频道.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input id="name" name="name" disabled={isPending} onChange={validateName}
                           placeholder="频道名称, 如'plan1-开发2组','plan2-产品1组'" minLength={3}/>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>创建</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}