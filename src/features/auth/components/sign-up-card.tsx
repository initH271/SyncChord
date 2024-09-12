import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {SignInFlow} from "../types";
import {FormEvent, useState} from "react";
import {useAuthActions} from "@convex-dev/auth/react";
import {TriangleAlert} from "lucide-react";

interface SignUpCardProps {
    setSignState: (state: SignInFlow) => void
}

export function SignUpCard({setSignState}: SignUpCardProps) {
    const {signIn} = useAuthActions();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    function handlePasswordSignUp(e: FormEvent<HTMLElement>) {
        e.preventDefault()
        if (password.length < 8) {
            setError("密码长度需要不小于8位")
            return
        }
        if (password !== confirmPass) {
            setError('两次密码输入不一致')
            return
        }
        setPending(true)
        signIn("password", {
            name, email, password,
            flow: "signUp"
        })
            .catch(() => {
                setError("无效的邮箱或密码")
            })
            .finally(() => {
                setPending(false)
            })
    }

    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    注册账号
                </CardTitle>
                <CardDescription>
                    使用邮箱注册
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
                <form className="space-y-2.5" action="" onSubmit={handlePasswordSignUp}>
                    <Input disabled={pending} onChange={(e) => { setName(e.target.value) }} type="text"
                           placeholder="昵称" required/>
                    <Input disabled={pending} onChange={(e) => { setEmail(e.target.value) }} type="email"
                           placeholder="邮箱" required/>
                    <Input disabled={pending} onChange={(e) => { setPassword(e.target.value) }} type="password"
                           placeholder="密码" required/>
                    <Input disabled={pending} onChange={(e) => { setConfirmPass(e.target.value) }} type="password"
                           placeholder="再次输入密码" required/>
                    <Button disabled={pending} type="submit" className="w-full" size={"lg"}>
                        注册
                    </Button>
                </form>

                <p className="text-xs text-muted-foreground">
                    已经有账号? <span onClick={() => { setSignState("signIn") }}
                                      className="text-sky-700 hover:underline cursor-pointer">去登录</span>
                </p>
            </CardContent>

        </Card>
    )
}