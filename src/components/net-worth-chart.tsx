import { Area, XAxis, YAxis, AreaChart, Line } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useSearch } from "@tanstack/react-router";

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
    npv: {
      label: "Net Present Value",
      color: "hsl(142.1 76.2% 36.3%)", // Green color for NPV
    },
  } satisfies ChartConfig;

  const { npv = "false" } = useSearch({ from: "/" });
  const showNpv = npv === "true";
  const inflationRate = 5;
  const assets = useQuery(api.assets.getAssets);
  const liabilities = useQuery(api.liabilities.getLiabilities);

  const startYear = 2025;
  const numPeriods = 30;
  const tickWidth = 5;
  const numTicks = numPeriods / tickWidth + 1;
  const ticks = Array.from({ length: numTicks }, (_, i) => {
    return startYear + i * tickWidth;
  });
  const netWorthData = Array.from({ length: numPeriods + 1 }, (_, i) => {
    const year = startYear + i;
    const assetsValue = assets?.reduce((acc, asset) => {
      if (
        asset.startYear <= year &&
        (asset.endYear === undefined || asset.endYear >= year)
      ) {
        // Calculate years of compound interest
        const yearsOfInterest = year - asset.startYear;
        // Calculate compound interest: P * (1 + r)^t
        const amount =
          asset.principalAmount *
          Math.pow(1 + asset.interestRate / 100, yearsOfInterest);
        return acc + amount;
      }
      return acc;
    }, 0);
    const liabilitiesValue = liabilities?.reduce((acc, liability) => {
      if (
        liability.startYear <= year &&
        (liability.endYear === undefined || liability.endYear >= year)
      ) {
        // Calculate years of compound interest
        const yearsOfInterest = year - liability.startYear;
        // Calculate compound interest: P * (1 + r)^t
        const amount =
          liability.principalAmount *
          Math.pow(1 + liability.interestRate / 100, yearsOfInterest);
        return acc - amount; // Negative because it's a liability
      }
      return -acc;
    }, 0);

    // Calculate NPV by discounting the net worth based on years from start
    const yearsFromStart = year - startYear;
    const npvFactor = !showNpv
      ? 1
      : 1 / Math.pow(1 + inflationRate / 100, yearsFromStart);

    return {
      date: year.toString(),
      assets: assetsValue! * npvFactor,
      liabilities: liabilitiesValue! * npvFactor,
      netWorth: (assetsValue! + liabilitiesValue!) * npvFactor,
    };
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[150px] w-full">
          <AreaChart data={netWorthData}>
            <XAxis
              dataKey="date"
              type="number"
              tickLine={false}
              axisLine={false}
              ticks={ticks}
              domain={[startYear, startYear + numPeriods]}
            />
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
            <Line
              dataKey="npv"
              fill="var(--color-npv)"
              stroke="var(--color-npv)"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
