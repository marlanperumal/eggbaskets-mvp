import { Bar } from "recharts";

import { YAxis } from "recharts";

import { XAxis } from "recharts";

import { BarChart } from "recharts";

import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer, type ChartConfig } from "./ui/chart";

export function LiquidityChart() {
  const config = {
    assets: {
      label: "Assets",
      color: "hsl(217.2 91.2% 59.8%)",
    },
    liabilities: {
      label: "Liabilities",
      color: "hsl(0 84.2% 60.2%)",
    },
  } satisfies ChartConfig;
  const netWorthData = useQuery(api.netWorth.getNetWorth);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[150px] w-full">
          <BarChart data={netWorthData} stackOffset="sign">
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Bar
              dataKey="assets"
              fill="var(--color-assets)"
              stroke="var(--color-assets)"
              stackId="a"
            />
            <Bar
              dataKey="liabilities"
              fill="var(--color-liabilities)"
              stroke="var(--color-liabilities)"
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
