import "quill/dist/quill.snow.css"
import {MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import Quill, {QuillOptions} from "quill";
import {Button} from "@/components/ui/button";
import {PiTextAa, PiTextTSlash} from "react-icons/pi";
import {ImageIcon, Smile, XIcon} from "lucide-react";
import {MdSend} from "react-icons/md";
import Hint from "@/components/hint";
import {Delta, Op} from "quill/core";
import {cn} from "@/lib/utils";
import EmojiPopover from "@/components/emoji-popover";
import Image from "next/image";

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
    const [selectedImage, setSelectedImage] = useState<File | null>(null) // 已选择图片

    const submitRef = useRef(onSubmit)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)
    const imageInputElemRef = useRef<HTMLInputElement | null>(null) // 提交图像元素


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
                                console.log("enter down event: insert new line")
                                quill.insertText(quill.getSelection()?.index || 0, "\n")
                                return; // return不为true时, 阻止handler的传播
                            }
                        },
                        ctrl_enter: {
                            key: "Enter",
                            ctrlKey: true,
                            handler: function () {
                                console.log("ctrl+enter down event: submit")
                                const text = quill.getText();
                                const submittedImage = imageInputElemRef.current?.files?.[0] || null;
                                if (!submittedImage && text.trim().replace(/\s|<(.|\n)*?>/g, "").length === 0) return;
                                submitRef.current({
                                    body: JSON.stringify(quill.getContents()),
                                    image: submittedImage,
                                })
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
        // TODO: 测试内容注意删除
        editor.firstElementChild!.innerHTML = `<p>ak好好学</p>`
        return () => {
            quill.off(Quill.events.TEXT_CHANGE)
            if (container) container.innerHTML = "";
            if (quillRef.current) quillRef.current = null;
            if (innerRef) innerRef.current = null;
        }
    }, [innerRef]);

    // 正则检测空内容
    // const isEmpty = !selectedImage && text.trim().replace(/\s|<(.|\n)*?>/g, "").length === 0;
    const isEmpty = useMemo(() => !selectedImage && text.trim().replace(/<(.|\n)*?>/g, "").length === 0, [selectedImage, text]);

    function toggleToolbar() {
        setToolbarVisible((t) => !t)
        const toolbarElem = containerRef.current?.querySelector(".ql-toolbar");
        if (toolbarElem) {
            toolbarElem.classList.toggle("hidden")
        }
    }

    function onSelectEmoji(emoji: any) {
        const quill = quillRef.current
        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)
    }

    return (
        <div className="flex flex-col">
            <input type="file" accept="image/*" ref={imageInputElemRef} onChange={(e) => {
                setSelectedImage(e.target.files![0]);
            }}
                   className={"hidden"}
            />
            <div
                className={cn("flex flex-col border border-slate-200 rounded-md transition focus-within:border-slate-300 focus-within:shadow-sm bg-white",
                    disabled && "opacity-50")}>
                <div ref={containerRef} className="h-full ql-custom"/>
                {
                    !!selectedImage && (
                        <div className="p-2">
                            <div className={"relative size-[62px] flex items-center justify-center group/image"}>
                                <Hint side={"top"} align={"center"} label={"删除图片"}>
                                    <button
                                        className="hidden group-hover/image:flex rounded-full  bg-black/70 hover:bg-black absolute z-[4] -top-2.5 -right-2.5 text-white size-6 border-2 border-white items-center justify-center "
                                        onClick={() => {
                                            setSelectedImage(null);
                                            imageInputElemRef.current!.value = "";
                                        }}>
                                        <XIcon className="size-3.5 "/>
                                    </button>
                                </Hint>
                                <Image src={URL.createObjectURL(selectedImage)} alt={selectedImage.name} fill
                                       className="rounded-xl overflow-hidden border object-cover"/>
                            </div>
                        </div>
                    )
                }
                <div className="flex px-2 pb-2 z-[5] w-full border-b shadow-sm">
                    <Hint label={toolbarVisible ? "隐藏工具栏" : "显示工具栏"} align={"center"} side={"top"}>
                        <Button disabled={disabled} size={"icon"} variant={"stone"}
                                onClick={toggleToolbar}>
                            {!toolbarVisible ? <PiTextAa className={"size-4"}/>
                                : <PiTextTSlash className={"size-4"}/>}
                        </Button>
                    </Hint>
                    <EmojiPopover onEmojiSelect={onSelectEmoji} hint={"选择emoji"}>
                        <Button disabled={disabled} size={"icon"} variant={"stone"}
                                onClick={(e) => e.preventDefault()}>
                            <Smile className={"size-4"}/>
                        </Button>
                    </EmojiPopover>
                    {
                        variant === "update" && (
                            <div className="ml-auto flex items-center gap-x-2">
                                <Hint label={"取消编辑"} align={"center"} side={"top"}>
                                    <Button disabled={disabled}
                                            size={"sm"}
                                            variant={"outline"}
                                            onClick={onCancel}>
                                        取消
                                    </Button>
                                </Hint>
                                <Hint label={"保存本次编辑"} align={"center"} side={"top"}>
                                    <Button disabled={disabled}
                                            size={"sm"}
                                            className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                                            variant={"default"}
                                            onClick={() => {
                                                onSubmit({
                                                    body: JSON.stringify(quillRef.current!.getContents()),
                                                    // body: JSON.stringify(quillRef.current?.getContents()),
                                                    image: selectedImage,
                                                })
                                            }}>
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            //
                                            imageInputElemRef.current?.click();
                                        }}>
                                    <ImageIcon className={"size-4"}/>
                                </Button>
                            </Hint>
                            <Hint label={"发送"} align={"center"} side={"top"}>
                                <Button
                                    className={cn("ml-auto", isEmpty ? "bg-white text-muted-foreground" : " bg-[#007a5a] hover:bg-[#007a5a]/80 text-white")}
                                    size={"icon"}
                                    disabled={disabled || isEmpty}
                                    variant={"stone"}
                                    onClick={() => {
                                        onSubmit({
                                            body: JSON.stringify(quillRef.current!.getContents()),
                                            // body: JSON.stringify(quillRef.current?.getContents()),
                                            image: selectedImage,
                                        })
                                    }}>
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