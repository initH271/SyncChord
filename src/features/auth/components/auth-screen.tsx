"use client"
import { SignInFlow } from "../types";
import { useState } from "react";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";



export default function AuthScreen() {
    const [signState, setSignState] = useState<SignInFlow>("signIn")
    return (
        <div className="h-full flex min-h-screen flex-col items-center justify-center bg-slate-200">
            <div className="md:h-auto md:w-[420px]">
                {signState === "signIn" ? <SignInCard setSignState={setSignState} /> : <SignUpCard setSignState={setSignState} />}
            </div>
        </div>
    );
}
