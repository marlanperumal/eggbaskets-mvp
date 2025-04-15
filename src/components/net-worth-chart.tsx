import { Area, XAxis, YAxis, Line, ComposedChart, Legend } from "recharts";
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
    netWorth: {
      label: "Net Worth",
      color: "hsl(142.1 76.2% 36.3%)",
    },
  } satisfies ChartConfig;

  const { npv: showNpv } = useSearch({ from: "/" });
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

        // Calculate compound interest on principal: P * (1 + r)^t
        const principalWithInterest =
          asset.principalAmount *
          Math.pow(1 + asset.interestRate / 100, yearsOfInterest);

        // Calculate compound interest on annual contributions if they exist
        // Formula: C * ((1 + r)^t - 1) / r
        // where C is annual contribution, r is interest rate, t is years
        const annualContributionWithInterest = asset.annualContribution
          ? asset.interestRate === 0
            ? asset.annualContribution * yearsOfInterest
            : asset.annualContribution *
              ((Math.pow(1 + asset.interestRate / 100, yearsOfInterest) - 1) /
                (asset.interestRate / 100))
          : 0;

        return acc + principalWithInterest + annualContributionWithInterest;
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

        // Calculate compound interest on principal: P * (1 + r)^t
        const principalWithInterest =
          liability.principalAmount *
          Math.pow(1 + liability.interestRate / 100, yearsOfInterest);

        // Calculate compound interest reduction from annual repayments if they exist
        // Formula: C * ((1 + r)^t - 1) / r
        // where C is annual repayment, r is interest rate, t is years
        const annualRepaymentWithInterest = liability.annualRepayment
          ? liability.annualRepayment *
            ((Math.pow(1 + liability.interestRate / 100, yearsOfInterest) - 1) /
              (liability.interestRate / 100))
          : 0;

        // Negative because it's a liability, and repayments reduce the liability
        return acc - (principalWithInterest - annualRepaymentWithInterest);
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
          <ComposedChart data={netWorthData}>
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
              dataKey="netWorth"
              fill="var(--color-netWorth)"
              stroke="var(--color-netWorth)"
              strokeWidth={3}
              type="monotone"
              dot={false}
            />
            <Legend />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
