import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader} from "@/components/ui/dialog"
import {DialogTitle} from "@radix-ui/react-dialog"
import {useState} from "react"

export default function useApproval(title: string, message: string): [() => JSX.Element, () => Promise<unknown>] {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)
    const approval = () => new Promise((resolve, reject) => {
        setPromise({resolve})
    })

    const handleClose = () => {
        setPromise(null)
    }
    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const handleApprove = () => {
        promise?.resolve(true)
        handleClose()
    }

    const ApprovalDialog = () => (
        <Dialog open={promise != null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-x-2">
                    <Button onClick={handleCancel} variant={"outline"}>
                        取消
                    </Button>
                    <Button onClick={handleApprove} variant={"default"}>
                        确认
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
    return [ApprovalDialog, approval]
}