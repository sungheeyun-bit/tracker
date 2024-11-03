"use client";

import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType;
}) {
  const filteredData = data.filter((el) => el.type === type);

  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <div className="relative h-80 w-full col-span-6">
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl bg-black/30" />

      <Card className="relative h-80 w-full bg-[#1e1f21] rounded-xl before:border-none after:border-none outline-none border-none">
        <CardHeader>
          <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
            {type === "income" ? "수입" : "지출"} 항목별 요약
          </CardTitle>
        </CardHeader>

        <div className="flex items-center justify-between gap-2">
          {filteredData.length === 0 && (
            <div className="flex h-60 w-full flex-col items-center justify-center text-gray-100">
              선택한 기간에 해당하는 데이터가 없습니다.
              <p className="text-sm text-muted-foreground">
                다른 기간을 선택하거나 새로운
                {type === "income" ? "수입" : "지출"} 항목을 추가해 보세요.
              </p>
            </div>
          )}

          {filteredData.length > 0 && (
            <ScrollArea className="h-60 w-full px-4">
              <div className="flex w-full flex-col gap-4 p-4">
                {filteredData.map((item) => {
                  const amount = item._sum.amount || 0;
                  const percentage = (amount * 100) / (total || amount);

                  return (
                    <div key={item.category} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-100">
                          {item.categoryIcon} {item.category}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({percentage.toFixed(0)}%)
                          </span>
                        </span>

                        <span className="text-sm text-gray-400">
                          {formatter.format(amount)}
                        </span>
                      </div>

                      <Progress
                        value={percentage}
                        indicator={
                          type === "income"
                            ? "bg-incomeColor"
                            : "bg-expenseColor"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </Card>
    </div>
  );
}
