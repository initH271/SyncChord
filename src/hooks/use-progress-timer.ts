import { useEffect, useState } from "react"

export const useProgressTimer = () => {
    const [progress, setProgress] = useState(0)
    const [complete, setComplete] = useState(false)
    useEffect(() => {
        const timer = setInterval(() => {
            if (complete) {
                clearInterval(timer)
            } else {
                setProgress((v) => v >= 100 ? 0 : v += 10)
            }
        }, 100);

        return () => clearTimeout(timer)
    }, [])

    return {
        progress, setComplete
    }
}