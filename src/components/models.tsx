"use client"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useMounted } from "@/hooks/use-mounted"
import { useEffect, useState } from "react"

export const Modals = () => {

    const { mounted } = useMounted()
    if (!mounted) return null
    return (
        <>
            <CreateWorkspaceModal />
        </>
    )
}