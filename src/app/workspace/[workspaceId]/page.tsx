interface WorkspaceIdPageProps {
    params: {
        workspaceId: string
    }
}

export default function WorkSpaceIdPage({ params }: WorkspaceIdPageProps) {
    
    return (
        <div>
            欢迎来到工作空间 {params.workspaceId}
        </div>
    )
}