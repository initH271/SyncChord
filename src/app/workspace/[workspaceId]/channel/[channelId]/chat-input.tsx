import dynamic from "next/dynamic";
import {useRef} from "react";
import Quill from "quill";
import {Delta} from "quill/core";

// 动态载入以支持热重载
const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

export function ChatInput({placeholder}: { placeholder: string }) {
    const editorRef = useRef<Quill | null>(null)

    function handleSubmit({body, image}: { body: string | Delta, image: File | null }) {
        console.log(
            "submitted: ",
            {body, image}
        )
    }

    return (
        <div className="flex flex-col p-2">
            <Editor variant={"create"} disabled={false}
                    placeholder={placeholder}
                    innerRef={editorRef} onSubmit={handleSubmit} onCancel={() => {console.log("canceled")}}/>
        </div>
    )
}