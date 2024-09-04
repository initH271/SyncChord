import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import { SignInFlow } from "../types";
import { useState } from "react";

interface SignUpCardProps {
    setSignState: (state: SignInFlow) => void
}

export function SignUpCard({ setSignState }: SignUpCardProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    注册账号
                </CardTitle>
                <CardDescription >
                    使用邮箱注册
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-5">
                <form className="space-y-2.5" action="">
                    <Input onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="邮箱" required />
                    <Input onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="密码" required />
                    <Input onChange={(e) => { setConfirmPass(e.target.value) }} type="password" placeholder="再次输入密码" required />
                    <Button type="submit" className="w-full" size={"lg"} disabled={false}>
                        注册
                    </Button>
                </form>

                <p className="text-xs text-muted-foreground">
                    已经有账号? <span onClick={() => { setSignState("signIn") }} className="text-sky-700 hover:underline cursor-pointer">去登录</span>
                </p>
            </CardContent>

        </Card>
    )
}