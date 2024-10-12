import {Button} from "@/components/ui/button";
import {AlertTriangle, Loader2, MailIcon, XIcon} from "lucide-react";
import {useGetMember} from "@/features/members/api/use-get-member";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

interface ProfileProps {
    memberId: string;
    onClose: () => void;
}


export default function Profile({memberId, onClose}: ProfileProps) {
    const {data: member, isLoading: loadingMember} = useGetMember({memberId})

    if (loadingMember) {
        return (
            <div className={"flex h-full items-center justify-center"}>
                <Loader2 className={"animate-spin size-7 text-muted-foreground"}/>
            </div>
        )
    }
    return (
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
                        <div className={"flex flex-col p-4"}>
                            <p className={"font-bold text-xl"}>
                                {member.user.name}
                            </p>
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
    )
}