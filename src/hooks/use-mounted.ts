import {useEffect, useState} from "react"

// 检查挂载hook
export const useMounted = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    return {mounted}
}