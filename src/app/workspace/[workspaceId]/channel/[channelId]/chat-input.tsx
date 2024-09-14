import dynamic from "next/dynamic";
import {useRef} from "react";
import Quill from "quill";

// 动态载入以支持热重载
const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

export function ChatInput({placeholder}: { placeholder: string }) {
    const editorRef = useRef<Quill | null>(null)
    return (
        <div className="flex flex-col p-2">
            <Editor variant={"create"} disabled={false}
                    placeholder={placeholder}
                    innerRef={editorRef} onSubmit={() => {}}/>
        </div>
    )
}