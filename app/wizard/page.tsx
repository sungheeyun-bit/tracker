import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          환영합니다,
          <span className="ml-2 font-bold">{user.firstName}님! 👋🏻</span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          통화를 설정하여 시작해보세요!
        </h2>
        <h3 className="mt-1.5 text-center text-sm text-muted-foreground">
          언제든지 이 설정을 변경하실 수 있습니다.
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>통화 설정</CardTitle>
          <CardDescription>
            거래에 사용할 기본 통화를 설정하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button wFull shadowType="square" asChild>
        <Link href={"/"}>완료! 대시보드로 이동하기</Link>
      </Button>

      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
}

export default page;
