import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa";
import {IoLogoWechat} from "react-icons/io5";
import {SignInFlow} from "../types";
import {FormEvent, useState} from "react";
import {useAuthActions} from "@convex-dev/auth/react"
import {TriangleAlert} from "lucide-react";

interface SignInCardProps {
    setSignState: (state: SignInFlow) => void
}

export function SignInCard({setSignState}: SignInCardProps) {

    const {signIn} = useAuthActions();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    function handlePasswordSignIn(e: FormEvent<HTMLElement>) {
        e.preventDefault()
        setPending(true)
        signIn("password", {email, password, flow: "signIn"})
            .catch(() => {
                setError("无效的邮箱或密码")
            })
            .finally(() => {
                setPending(false)
            })
    }

    function handleProviderSign(provider: "github" | "google" | "wechat") {
        if (provider == "wechat") {
            console.log("暂未实现微信登录");
            return
        }
        setPending(true)
        signIn(provider).finally(() => {
            setPending(false)
        })

    }

    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    登录以进入 404 SPACE
                </CardTitle>
                <CardDescription>
                    使用邮箱或其他账户登录
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                    <TriangleAlert className="size-4"/>
                    <p>
                        {error}
                    </p>
                </div>
            )}
            <CardContent className="px-0 pb-0 space-y-5">
                <form className="space-y-2.5" action="" onSubmit={handlePasswordSignIn}>
                    <Input disabled={pending} onChange={(e) => { setEmail(e.target.value) }} type="email"
                           placeholder="邮箱" required/>
                    <Input disabled={pending} onChange={(e) => { setPassword(e.target.value) }} type="password"
                           placeholder="密码" required/>
                    <Button disabled={pending} type="submit" className="w-full" size={"lg"}>
                        登录
                    </Button>
                </form>
                <Separator/>
                <div className="flex flex-col gap-y-2.5">
                    <Button disabled={pending} onClick={() => { handleProviderSign("google") }} variant={"outline"}
                            size={"lg"} className="w-full relative ">
                        使用Google登录<FcGoogle className="absolute top-3 left-2.5 size-5"></FcGoogle>
                    </Button>
                    <Button disabled={pending} onClick={() => { handleProviderSign("github") }} variant={"outline"}
                            size={"lg"} className="w-full relative">
                        使用Github登录<FaGithub className="absolute top-3 left-2.5 size-5"/>
                    </Button>
                    <Button disabled={pending} onClick={() => { handleProviderSign("wechat") }} variant={"outline"}
                            size={"lg"} className="w-full relative">
                        使用微信登录<IoLogoWechat className="absolute top-3 left-2.5 size-5"/>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    目前还没有账号? <span onClick={() => { setSignState("signUp") }}
                                          className="text-sky-700 hover:underline cursor-pointer">创建一个</span>
                </p>
            </CardContent>

        </Card>
    )
}