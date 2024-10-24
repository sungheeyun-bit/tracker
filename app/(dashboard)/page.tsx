import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background px-8">
      <div className="border-b bg-card">
        <div className="w-full flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">안녕하세요, {user.firstName}! 👋🏻</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-black rounded-xl bg-incomeColor"
                  shadowType="square"
                >
                  새 수입 🤑
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-black rounded-xl bg-expenseColor"
                  shadowType="square"
                >
                  새 지출 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
