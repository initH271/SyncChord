"use client"

import {useCreateWorkspaceModal} from "@/features/workspaces/store/use-create-workspace-modal";
import {useGetWorkspaces} from "@/features/workspaces/api/use-get-workspaces";
import {useEffect, useMemo} from "react";
import {useRouter} from "next/navigation";
import LoadingPage from "@/components/loading-page";

export default function Home() {

    const router = useRouter()
    const [openCWM, setOpenCWM] = useCreateWorkspaceModal()

    const {data, isLoading} = useGetWorkspaces()

    const workspaceId = useMemo(() => data?.[0]?._id, [data])
    // 检查是否已存在workspace
    useEffect(() => {
        if (isLoading) {
            return
        }
        console.log("workspaceId: ", workspaceId);
        if (workspaceId) {
            console.log("进入workspace...");
            router.push(`/workspace/${workspaceId}`)
            return
        }
        if (!workspaceId && !openCWM) {
            console.log("创建workspace...");
            setOpenCWM(true)
            return
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, workspaceId])

    return (
        <LoadingPage/>
    );
}
