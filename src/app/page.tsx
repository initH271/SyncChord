"use client"

import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {


  return (
    <main className="h-full min-h-full flex items-center justify-center">
      已经登录
      <UserButton />

    </main>
  );
}
