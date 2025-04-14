import { Area, XAxis, YAxis, AreaChart } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

export function NetWorthChart() {
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
        <CardTitle>Net Worth</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[150px] w-full">
          <AreaChart data={netWorthData}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Area
              dataKey="assets"
              fill="var(--color-assets)"
              stroke="var(--color-assets)"
            />
            <Area
              dataKey="liabilities"
              fill="var(--color-liabilities)"
              stroke="var(--color-liabilities)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
