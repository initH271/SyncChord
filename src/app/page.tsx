"use client"

import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {

  const { signOut } = useAuthActions()

  return (
    <main className="h-full min-h-full flex flex-col items-center justify-center">
      已经登录
      <Button onClick={() => { signOut() }}>
        退出登录
      </Button>
    </main>
  );
}
