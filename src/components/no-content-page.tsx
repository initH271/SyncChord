import {TriangleAlert} from "lucide-react";

export default function NoContentPage({content}: { content: string }) {
    return (
        <main className="h-full min-h-full flex gap-x-2 items-center justify-center">
            <TriangleAlert className="size-8 text-muted-foreground"/>
            <span className={"text-md text-muted-foreground"}>
                {content}
            </span>
        </main>
    )
}