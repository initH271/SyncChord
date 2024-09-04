"use client"

import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { UseGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()
  const [open, setOpen] = useCreateWorkspaceModal()

  const { data, isLoading } = UseGetWorkspaces()

  const workspaceId = useMemo(() => data?.[0]?._id, [data])
  // 检查是否已存在workspace
  useEffect(() => {
    if (isLoading)
      return;
    console.log("workspaceId: ", workspaceId);

    if (workspaceId) {
      console.log("进入workspace...");
      router.push(`/workspace/${workspaceId}`)
    } else if (!open) {
      console.log("创建workspace...");
      setOpen(true)
    }

  }, [workspaceId, isLoading])


  return (
    <main className="h-full min-h-full flex items-center justify-center">
      已经登录
      <UserButton />
    </main>
  );
}
