import {Button} from "@/components/ui/button";
import {AlertTriangle, ChevronDownIcon, Loader2, MailIcon, XIcon} from "lucide-react";
import {useGetMember} from "@/features/members/api/use-get-member";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {useUpdateMember} from "@/features/members/api/use-update-member";
import {useRemoveMember} from "@/features/members/api/use-remove-member";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import useApproval from "@/hooks/use-confirm";

interface ProfileProps {
    memberId: string;
    onClose: () => void;
}


export default function Profile({memberId, onClose}: ProfileProps) {
    const workspaceId = useWorkspaceId()
    const {data: currentMember, isLoading: loadingCurrentMember} = useCurrentMember({workspaceId})
    const {mutate: updateMember, isPending: updatingMember} = useUpdateMember()
    const {mutate: removeMember, isPending: removingMember} = useRemoveMember()
    const {data: member, isLoading: loadingMember} = useGetMember({memberId})
    const router = useRouter()
    const [LeaveDialog, confirmLeave] = useApproval("离开工作空间", "你确定要离开么?")
    const [RemoveDialog, confirmRemove] = useApproval("删除成员", `你确定要删除${member?.user.name}么?`)
    const [UpdateDialog, confirmUpdate] = useApproval("修改成员身份", `你确定要修改${member?.user.name}的角色么?`)
    const onRemoveMember = async () => {
        const ok = await confirmRemove()
        if (!ok) return;
        await removeMember({id: memberId}, {
            onSuccess: () => {
                toast.success("操作成功")
                router.replace(`${window.location.origin}/workspace/${workspaceId}`)
            },
            onError: error => {
                toast.error("操作失败:" + error.message)
            },
        });
    }
    const onLeaveMember = async () => {
        const ok = await confirmLeave()
        if (!ok) return;
        await removeMember({id: memberId}, {
            onSuccess: () => {
                toast.success("操作成功")
                router.replace(`${window.location.origin}`)
            },
            onError: error => {
                toast.error("操作失败:" + error.message)
            },
        });
    }
    const onUpdateMember = async (role: "admin" | "member") => {
        const ok = await confirmUpdate()
        if (!ok) return;
        await updateMember({id: memberId, role}, {
            onSuccess: () => {
                toast.success("操作成功")
            },
            onError: error => {
                toast.error("操作失败:" + error.message)
            }
        })
    }
    if (loadingMember || loadingCurrentMember) {
        return (
            <div className={"flex h-full items-center justify-center"}>
                <Loader2 className={"animate-spin size-7 text-muted-foreground"}/>
            </div>
        )
    }
    return (
        <>
            <LeaveDialog/>
            <RemoveDialog/>
            <UpdateDialog/>
            <div className={"thread-panel h-full w-full flex-col flex bg-[#fdfcfa]"}>
                <div className={"thread-header h-[49px] flex justify-between items-center p-4 border-b"}>
                    <p className={"text-lg font-bold"}>Profile</p>
                    <Button variant={"ghost"} className={""} size={"icon_sm"} onClick={onClose}>
                        <XIcon className={"size-5 stroke-2"}/>
                    </Button>
                </div>
                {!member && (
                    <div className={"flex h-full gap-x-2 items-center justify-center"}>
                        <AlertTriangle className={" size-7 text-muted-foreground"}/>
                        <p className={"text-muted-foreground text-sm"}>成员信息未找到</p>
                    </div>
                )}
                {member && (
                    <>
                        <div className={"flex flex-col p-4 items-center justify-center"}>
                            <Avatar
                                className="max-w-[128px] max-h-[128px] size-full hover:opacity-75 transition rounded-md">
                                <AvatarImage src={member.user.image} className={"rounded-md"}/>
                                <AvatarFallback className="aspect-square text-6xl rounded-md bg-sky-400 text-white">
                                    {member.user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className={"flex flex-col p-4 items-center"}>
                                <p className={"font-bold text-xl"}>{member.user.name}</p>
                                {currentMember?.role === "admin" && currentMember._id !== memberId && (
                                    <div className={"flex items-center mt-4 gap-2"}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant={"outline"} className={"w-full capitalize"}>
                                                    {member.role === "admin" ? "管理员" : "普通成员"} <ChevronDownIcon
                                                    className={"size-4 ml-2"}/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={async () => {
                                                    await onUpdateMember(member.role === "admin" ? "member" : "admin")
                                                }} disabled={updatingMember}
                                                                  className="cursor-pointer capitalize hover:bg-[#f0eeeb]">
                                                    <div className="flex items-center gap-1">
                                                        {member.role === "admin" ? "普通成员" : "管理员"}
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button variant={"outline"} className={"w-full capitalize"}
                                                onClick={onRemoveMember} disabled={removingMember}>
                                            删除
                                        </Button>
                                    </div>
                                )}
                                {currentMember?.role !== "admin" && currentMember?._id === memberId && (
                                    <div className={"flex items-center mt-4 gap-2"}>
                                        <Button variant={"outline"}
                                                className={"w-full capitalize hover:bg-red-600 hover:text-white"}
                                                onClick={onLeaveMember} disabled={removingMember}>
                                            退出工作空间
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Separator/>
                        <div className={"flex flex-col p-4"}>
                            <p className={"font-bold text-md mb-4"}>联系方式</p>
                            <div className={"flex items-center gap-2"}>
                                <div className={"size-9 rounded-md bg-muted flex items-center justify-center"}>
                                    <MailIcon className={"size-4"}/>
                                </div>
                                <div className={"flex flex-col"}>
                                    <p className={"text-sm font-semibold"}>邮箱地址</p>
                                    <Link className={"text-sm hover:underline text-[#007bbb]"}
                                          href={`mailto:${member.user.email}`}>{member.user.email}</Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}