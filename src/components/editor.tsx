import "quill/dist/quill.snow.css"
import {MutableRefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import Quill, {QuillOptions} from "quill";
import {Button} from "@/components/ui/button";
import {PiTextAa, PiTextTSlash} from "react-icons/pi";
import {ImageIcon, Smile} from "lucide-react";
import {MdSend} from "react-icons/md";
import Hint from "@/components/hint";
import {Delta, Op} from "quill/core";
import {cn} from "@/lib/utils";

type EditorValue = {
    image: File | null;
    body: string;
}

interface EditorProps {
    variant?: "create" | "update";
    onSubmit: ({image, body}: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>
}

export default function Editor({
    variant = "create", onSubmit, onCancel, placeholder, defaultValue,
    disabled, innerRef
}: EditorProps) {
    const [text, setText] = useState("")
    const [toolbarVisible, setToolbarVisible] = useState(true) // 工具栏可见

    const submitRef = useRef(onSubmit)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)

    const containerRef = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        submitRef.current = onSubmit
        placeholderRef.current = placeholder
        disabledRef.current = disabled
        defaultValueRef.current = defaultValue
    })
    useEffect(() => {
        if (!containerRef.current) return;
        // 使用quill https://quilljs.com/docs/quickstart
        const container = containerRef.current
        const editor = container.appendChild(container.ownerDocument.createElement("div"))
        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                keyboard: {
                    bindings: { // 修改键盘绑定配置, https://quilljs.com/docs/modules/keyboard
                        enter: {
                            key: "Enter",
                            handler: function () {
                                console.log("enter down")
                                return; // return不为true时, 阻止handler的传播
                            }
                        },
                        ctrl_enter: {
                            key: "Enter",
                            ctrlKey: true,
                            handler: function () {
                                console.log("ctrl+enter down")
                                return;
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: function () {
                                console.log("shift+enter down")
                                // 切换到新一行的默认实现
                                quill.insertText(quill.getSelection()?.index || 0, "\n")
                                return;
                            }
                        }
                    }
                }
            }
        }
        const quill = new Quill(editor, options)
        // 渲染完毕后自动聚焦, 初始化
        quillRef.current = quill
        quill.focus()
        quill.setContents(defaultValueRef.current!)
        setText(quillRef.current.getText())
        quill.on(Quill.events.TEXT_CHANGE, () => {
            // 监听文本修改事件
            setText(quill.getText())
        })

        if (innerRef) {
            // 将编辑器ref传递给组件外
            innerRef.current = quill
        }
        // 测试内容
//         editor.firstElementChild!.innerHTML = `<p>Hello World!</p>
// <p>Some initial <strong>bold</strong> text</p>
// <p>help: <a href="https://quilljs.com/docs/quickstart">quickstart</a></p>`
        return () => {
            quill.off(Quill.events.TEXT_CHANGE)
            if (container) container.innerHTML = "";
            if (quillRef.current) quillRef.current = null;
            if (innerRef) innerRef.current = null;
        }
    }, [innerRef]);

    // 正则检测空内容
    const isEmpty = text.trim().replace(/\s|<(.|\n)*?>/g, "").length === 0;

    function toggleToolbar() {
        setToolbarVisible((t) => !t)
        const toolbarElem = containerRef.current?.querySelector(".ql-toolbar");
        if (toolbarElem) {
            toolbarElem.classList.toggle("hidden")
        }
    }

    return (
        <div className="flex flex-col">
            <div
                className="flex flex-col border border-slate-200 rounded-md
                transition
                focus-within:border-slate-300 focus-within:shadow-sm bg-white">
                <div ref={containerRef} className="h-full ql-custom"/>
                <div className="flex px-2 pb-2 z-[5] w-full border-b shadow-sm">
                    <Hint label={toolbarVisible ? "隐藏工具栏" : "显示工具栏"} align={"center"} side={"top"}>
                        <Button disabled={disabled} size={"icon"} variant={"stone"}
                                onClick={toggleToolbar}>
                            {!toolbarVisible ? <PiTextAa className={"size-4"}/>
                                : <PiTextTSlash className={"size-4"}/>}
                        </Button>
                    </Hint>
                    <Hint label={"选择表情"} align={"center"} side={"top"}>
                        <Button disabled={disabled} size={"icon"} variant={"stone"}
                                onClick={(e) => e.preventDefault()}>
                            <Smile className={"size-4"}/>
                        </Button>
                    </Hint>
                    {
                        variant === "update" && (
                            <div className="ml-auto flex items-center gap-x-2">
                                <Hint label={"取消编辑"} align={"center"} side={"top"}>
                                    <Button disabled={disabled}
                                            size={"sm"}
                                            variant={"outline"}
                                            onClick={(e) => e.preventDefault()}>
                                        取消
                                    </Button>
                                </Hint>
                                <Hint label={"保存本次编辑"} align={"center"} side={"top"}>
                                    <Button disabled={disabled}
                                            size={"sm"}
                                            className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                                            variant={"default"}
                                            onClick={(e) => e.preventDefault()}>
                                        保存
                                    </Button>
                                </Hint>
                            </div>
                        )
                    }
                    {variant === "create" && (
                        <>
                            <Hint label={"选择图像"} align={"center"} side={"top"}>
                                <Button disabled={disabled}
                                        size={"icon"} variant={"stone"}
                                        onClick={(e) => e.preventDefault()}>
                                    <ImageIcon className={"size-4"}/>
                                </Button>
                            </Hint>
                            <Hint label={"发送"} align={"center"} side={"top"}>
                                <Button
                                    className={cn("ml-auto", isEmpty ? "bg-white text-muted-foreground" : " bg-[#007a5a] hover:bg-[#007a5a]/80 text-white")}
                                    size={"icon"}
                                    disabled={disabled || isEmpty}
                                    variant={"stone"}
                                    onClick={(e) => e.preventDefault()}>
                                    <MdSend className={"size-4"}/>
                                </Button>
                            </Hint>
                        </>
                    )}
                </div>
                <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
                    <p className="flex gap-x-2">快捷键<strong>Shift + Enter </strong> 切换到新一行
                    </p>
                </div>
            </div>
        </div>
    )
}