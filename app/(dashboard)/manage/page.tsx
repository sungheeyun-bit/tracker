"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, Trash2Icon, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";

function page() {
  return (
    <div className="px-8">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">관리</p>
            <p className="text-muted-foreground">
              계정 설정 및 카테고리를 관리하세요
            </p>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>통화 설정</CardTitle>
            <CardDescription>거래 기본 통화를 설정하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </div>
  );
}

export default page;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown
                  className="h-12 w-12 items-center rounded-lg p-2 text-black bg-[#8a8ddc]"
                  strokeWidth="3"
                />
              ) : (
                <TrendingUp
                  className="h-12 w-12 items-center rounded-lg p-2 text-black bg-[#82c255]"
                  strokeWidth="3"
                />
              )}
              <div>
                {type === "income" ? "수입" : "지출"} 카테고리
                <div className="text-sm font-normal mt-1 text-muted-foreground">
                  이름 기준으로 정렬된 목록
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  카테고리 추가
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-incomeColor" : "text-expenseColor"
                )}
              >
                {type === "income" ? "수입" : "지출"}
              </span>
              카테고리가 없습니다
            </p>

            <p className="text-sm text-muted-foreground">
              하나를 추가하여 시작하세요
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-4 p-4 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-lg border shadow-md shadow-black/[0.1] dark:shadow-none">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
          >
            <Trash2Icon className="h-4 w-4" />
            삭제
          </Button>
        }
      />
    </div>
  );
}
