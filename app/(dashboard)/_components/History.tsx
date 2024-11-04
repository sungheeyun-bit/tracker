"use client";

import HistoryPeriodSelector from "./HistoryPeriodSelector";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { Period, Timeframe } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { GetHistoryDataResponseType } from "@/app/api/history-data/route";

function History({ userSettings }: { userSettings: UserSettings }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const historyDataQuery = useQuery<GetHistoryDataResponseType>({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      ).then((res) => res.json()),
  });

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  return (
    <div className="container mb-4">
      <h2 className="mt-12 text-3xl font-bold">기간별 차트</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />

            <div className="flex h-10 gap-2">
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-incomeColor"></div>
                수입
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-expenseColor"></div>
                지출
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable ? (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart data={historyDataQuery.data} barCategoryGap={5}>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    strokeOpacity={"0.2"}
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data: GetHistoryDataResponseType[number]) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === "year") {
                        return date.toLocaleDateString("ko-KR", {
                          month: "long",
                        });
                      }
                      return date.toLocaleDateString("ko-KR", {
                        day: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={"income"}
                    fill="#a1e86d"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={"expense"}
                    fill="#a4a7f6"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={<CustomTooltip formatter={formatter} />}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                선택된 기간에 대한 데이터가 없습니다.
                <p className="text-sm text-muted-foreground">
                  다른 기간을 선택하거나 새로운 거래를 추가해보세요.
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default History;

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: GetHistoryDataResponseType[number] }[];
  formatter: Intl.NumberFormat;
}

function CustomTooltip({ active, payload, formatter }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow
        formatter={formatter}
        label="지출"
        value={expense}
        bgColor="bg-expenseColor"
        textColor="text-expenseColor"
      />
      <TooltipRow
        formatter={formatter}
        label="수입"
        value={income}
        bgColor="bg-incomeColor"
        textColor="text-incomeColor"
      />
      <TooltipRow
        formatter={formatter}
        label="잔액"
        value={income - expense}
        bgColor="bg-balanceColor"
        textColor="text-balanceColor"
      />
    </div>
  );
}

interface TooltipRowProps {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  formatter: Intl.NumberFormat;
}

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: TooltipRowProps) {
  const formattingFn = useCallback(
    (value: number) => formatter.format(value),
    [formatter]
  );

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
