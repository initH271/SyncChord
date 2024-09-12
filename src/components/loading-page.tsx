import {Loader2} from "lucide-react";

export default function LoadingPage() {
    return (
        <main className="h-full min-h-full flex items-center justify-center">
            <Loader2 className="size-12 animate-spin"/>
        </main>
    )
}