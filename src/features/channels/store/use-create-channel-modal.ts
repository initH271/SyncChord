import { atom, useAtom } from "jotai"

const modalState = atom(false)

// 原子化且全局化 modal状态
export const useCreateChannelModal = () => {
    return useAtom(modalState)
}