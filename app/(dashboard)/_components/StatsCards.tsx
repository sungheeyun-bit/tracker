"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-4 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="수입"
          background="bg-incomeColor"
          icon={
            <TrendingUp
              className="h-12 w-12 items-center rounded-lg p-2 text-black bg-[#82c255]"
              strokeWidth="3"
            />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="지출"
          background="bg-expenseColor"
          icon={
            <TrendingDown
              className="h-12 w-12 items-center rounded-lg p-2 text-black bg-[#8a8ddc]"
              strokeWidth="3"
            />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="잔액"
          background="bg-balanceColor"
          icon={
            <Wallet
              className="h-12 w-12 items-center rounded-lg p-2 text-black bg-[#bcad56]"
              strokeWidth="3"
            />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  background,
  icon,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: string;
  background: string;
  value: number;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className="relative flex h-24 w-full items-center">
      <div
        className="absolute h-full w-full rounded-xl border-2 border-black/80 dark:border-none bg-black/60 translate-x-2 translate-y-2"
        style={{ zIndex: 0 }}
      />
      <Card
        className={`flex h-full w-full rounded-xl items-center gap-4 p-4 relative z-10 ${background} border-2 border-black/80`}
      >
        {icon}
        <div className="flex flex-col items-start gap-0">
          <p className="text-muted-foreground dark:text-gray-600">{title}</p>
          <CountUp
            preserveValue
            redraw={false}
            end={value}
            decimals={2}
            formattingFn={formatFn}
            className="text-2xl font-medium dark:text-black"
          />
        </div>
      </Card>
    </div>
  );
}
