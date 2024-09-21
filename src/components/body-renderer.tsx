import {useEffect, useRef, useState} from "react";
import Quill from "quill";

interface BodyRendererProps {
    value: string
}

// 富文本内容渲染组件
export default function BodyRenderer({value}: BodyRendererProps) {
    const [isEmpty, setIsEmpty] = useState(false)
    const rendererRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!rendererRef.current) return;
        const container = rendererRef.current
        const quill = new Quill(document.createElement("div"), {theme: "snow"})
        quill.enable(false) // 只读不编辑
        const contents = JSON.parse(value)
        quill.setContents(contents)
        setIsEmpty(quill.getText().trim().replace(/<(.|\n)*?>/g, "").length === 0)
        container.innerHTML = quill.root.innerHTML
        return () => {
            if (container) {
                container.innerHTML = "";
            }
        }
    }, [value]);
    if (isEmpty) return null
    return (
        <div ref={rendererRef} className="ql-editor ql-renderer">
        </div>
    )
}