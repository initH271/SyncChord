import {useProgressTimer} from "@/hooks/use-progress-timer"
import {Progress} from "./ui/progress"
import {cn} from "@/lib/utils"

export default function LoadingProgress({className}: { className?: string }) {
    const {progress: progressValue} = useProgressTimer()
    return (
        <Progress className={cn("w-full h-2.5 bg-transparent", className)} value={progressValue}/>
    )
}