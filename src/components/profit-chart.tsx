import { XAxis } from "recharts";

import { YAxis } from "recharts";

import { Line } from "recharts";

import { LineChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer, type ChartConfig } from "./ui/chart";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";

export function ProfitChart() {
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
        <CardTitle>Profit</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[150px] w-full">
          <LineChart data={netWorthData}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Line
              dataKey="assets"
              fill="var(--color-assets)"
              stroke="var(--color-assets)"
              dot={false}
              type="natural"
            />
            <Line
              dataKey="liabilities"
              fill="var(--color-liabilities)"
              stroke="var(--color-liabilities)"
              dot={false}
              type="natural"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
