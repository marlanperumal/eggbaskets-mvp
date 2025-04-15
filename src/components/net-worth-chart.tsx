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
    const accountBalanceReductions: Record<string, number> = {};

    const assetsValue = assets?.reduce((acc, asset) => {
      if (
        asset.startYear <= year &&
        (asset.endYear === undefined || asset.endYear >= year)
      ) {
        const yearsOfInterest = year - asset.startYear;
        const principalWithInterest =
          asset.principalAmount *
          Math.pow(1 + asset.interestRate / 100, yearsOfInterest);

        const annualContributionWithInterest = asset.annualContribution
          ? asset.interestRate === 0
            ? asset.annualContribution * yearsOfInterest
            : asset.annualContribution *
              ((Math.pow(1 + asset.interestRate / 100, yearsOfInterest) - 1) /
                (asset.interestRate / 100))
          : 0;

        // Track reductions from source accounts
        if (asset.fromAccount && asset.annualContribution) {
          accountBalanceReductions[asset.fromAccount] =
            (accountBalanceReductions[asset.fromAccount] || 0) +
            asset.annualContribution * yearsOfInterest;
        }

        return acc + principalWithInterest + annualContributionWithInterest;
      }
      return acc;
    }, 0);

    const liabilitiesValue = liabilities?.reduce((acc, liability) => {
      if (
        liability.startYear <= year &&
        (liability.endYear === undefined || liability.endYear >= year)
      ) {
        const yearsOfInterest = year - liability.startYear;
        const principalWithInterest =
          liability.principalAmount *
          Math.pow(1 + liability.interestRate / 100, yearsOfInterest);

        const annualRepaymentWithInterest = liability.annualRepayment
          ? liability.interestRate === 0
            ? liability.annualRepayment * yearsOfInterest
            : liability.annualRepayment *
              ((Math.pow(1 + liability.interestRate / 100, yearsOfInterest) -
                1) /
                (liability.interestRate / 100))
          : 0;

        // Track reductions from source accounts
        if (liability.fromAccount && liability.annualRepayment) {
          accountBalanceReductions[liability.fromAccount] =
            (accountBalanceReductions[liability.fromAccount] || 0) +
            liability.annualRepayment * yearsOfInterest;
        }

        return acc - (principalWithInterest - annualRepaymentWithInterest);
      }
      return -acc;
    }, 0);

    // Apply reductions to the final asset value
    const finalAssetsValue =
      assetsValue! -
      Object.values(accountBalanceReductions).reduce(
        (sum, val) => sum + val,
        0
      );

    const yearsFromStart = year - startYear;
    const npvFactor = !showNpv
      ? 1
      : 1 / Math.pow(1 + inflationRate / 100, yearsFromStart);

    return {
      date: year.toString(),
      assets: finalAssetsValue * npvFactor,
      liabilities: liabilitiesValue! * npvFactor,
      netWorth: (finalAssetsValue + liabilitiesValue!) * npvFactor,
    };
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="w-full">
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
