"use client"
import Image from "next/image";
import VerificationInput from "react-verification-input";
import {Button} from "@/components/ui/button";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useRouter, useSearchParams} from "next/navigation";
import {useGetWorkspaceInfo} from "@/features/workspaces/api/use-get-workspace";
import LoadingPage from "@/components/loading-page";
import {useJoinWorkspace} from "@/features/workspaces/api/use-join-workspace";
import {toast} from "sonner";
import {useEffect, useMemo, useState} from "react";

export default function JoinPage() {

    const workspaceId = useWorkspaceId();
    const searchParams = useSearchParams()
    const {data, isLoading} = useGetWorkspaceInfo({id: workspaceId})
    const {mutate, isPending} = useJoinWorkspace()
    const [code, setCode] = useState(searchParams.get("joinCode" || ""))
    const router = useRouter()

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);
    useEffect(() => {
        if (isMember) router.push(`/workspace/${workspaceId}`);
    }, [isMember, router, workspaceId]);

    async function handleJoin() {
        if (code?.length !== 8) return;
        await mutate({
            workspaceId, joinCode: code!
        }, {
            onSuccess: () => {
                toast.success(`已成功加入${data?.name}.`)
                router.push(`/workspace/${workspaceId}`)
            },
            onError: error => {
                toast.error(`${error.message}`)
            }
        })
    }


    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }
    return (
        <div className={"h-full w-full flex flex-col items-center justify-center shadow-sm p-8 gap-y-2 bg-[#fdfcfa]"}>
            <Image src={"/logo.svg"} height={120} width={120} alt={"joinLogo"}/>
            <div className={"flex flex-col items-center justify-center gap-y-4 max-w-screen-lg"}>
                <div className={"flex flex-col items-center justify-center gap-y-2"}>
                    <p className={"text-2xl font-bold"}>
                        加入 {isLoading ? "Workspace" : data?.name}
                    </p>
                    <p className={"text-md text-muted-foreground"}>
                        输入邀请码进行验证
                    </p>
                </div>
                <div className={"flex flex-col items-center justify-center gap-y-2"}>
                    <VerificationInput
                        value={code!}
                        onComplete={handleJoin}
                        onChange={setCode}
                        length={8}
                        placeholder={"_"}
                        validChars={"0-9a-zA-Z"}
                        classNames={{
                            container: "flex gap-x-2",
                            character: "uppercase h-auto rounded-md border border-grey-300 font-medium text-grey-500 flex items-center justify-center w-[50]",
                            characterInactive: "bg-muted",
                            characterSelected: "bg-white text-black",
                            characterFilled: "bg-white text-black ",
                        }}
                        autoFocus
                    />
                </div>
                <div className={"flex items-between justify-center gap-x-2"}>
                    <Button onClick={() => {
                        router.push("/")
                    }} variant={"default"}>
                        返回主页
                    </Button>
                    <Button disabled={code?.length !== 8} onClick={handleJoin} variant={"default"}>
                        加入
                    </Button>
                </div>
            </div>
        </div>
    )
}