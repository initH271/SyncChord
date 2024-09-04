import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import { SignInFlow } from "../types";
import { useState } from "react";

interface SignInCardProps {
    setSignState: (state: SignInFlow) => void
}

export function SignInCard({ setSignState }: SignInCardProps) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    登录以进入 404 SPACE
                </CardTitle>
                <CardDescription >
                    使用邮箱或其他账户登录
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-5">
                <form className="space-y-2.5" action="">
                    <Input onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="邮箱" required />
                    <Input onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="密码" required />
                    <Button type="submit" className="w-full" size={"lg"} disabled={false}>
                        登录
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button variant={"outline"} size={"lg"} className="w-full relative ">
                        使用Google登录<FcGoogle className="absolute top-3 left-2.5 size-5"></FcGoogle>
                    </Button>
                    <Button variant={"outline"} size={"lg"} className="w-full relative">
                        使用Github登录<FaGithub className="absolute top-3 left-2.5 size-5" />
                    </Button>
                    <Button variant={"outline"} size={"lg"} className="w-full relative">
                        使用微信登录<IoLogoWechat className="absolute top-3 left-2.5 size-5" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    目前还没有账号? <span onClick={() => { setSignState("signUp") }} className="text-sky-700 hover:underline cursor-pointer">创建一个</span>
                </p>
            </CardContent>

        </Card>
    )
}