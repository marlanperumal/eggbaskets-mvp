import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useSearch } from "@tanstack/react-router";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Route } from "@/routes/retirement";

const config = {
  actualWithdrawals: {
    label: "Actual Annual Withdrawals",
    color: "hsl(217.2 91.2% 59.8%)",
  },
  desiredWithdrawals: {
    label: "Desired Annual Withdrawals",
    color: "hsl(0 0% 25.1%)",
  },
  annuityValue: {
    label: "Annuity Value",
    color: "hsl(0 84.2% 60.2%)",
  },
} satisfies ChartConfig;

export function RetirementResultChart() {
  const searchParams = useSearch({ from: Route.fullPath });
  const {
    currentAge,
    retirementAge,
    numYearsRequired,
    monthlyWithdrawal,
    interestRate,
    inflationRate,
    lumpsumRemaining,
  } = searchParams;

  if (
    !currentAge ||
    !retirementAge ||
    !numYearsRequired ||
    !monthlyWithdrawal ||
    !interestRate ||
    !inflationRate ||
    !lumpsumRemaining
  ) {
    return null;
  }

  const yearsTillRetirement = retirementAge - currentAge;
  const realInterestRate = (interestRate - inflationRate) / 100;
  const annualWithdrawal = monthlyWithdrawal * 12;
  const annuityPrincipal =
    (annualWithdrawal * (1 - (1 + realInterestRate) ** -numYearsRequired)) /
      realInterestRate +
    lumpsumRemaining / (1 + realInterestRate) ** yearsTillRetirement;
  const years = Array.from(
    { length: numYearsRequired + 1 },
    (_, i) => i + retirementAge
  );
  const desiredWithdrawals = years.map(
    (year, _) =>
      annualWithdrawal * (1 + inflationRate / 100) ** (year - currentAge)
  );
  const annuityValues = years.map((year, i) => {
    const annuityValue =
      annuityPrincipal * (1 + realInterestRate) ** i +
      (annualWithdrawal * (1 - (1 + realInterestRate) ** i)) / realInterestRate;
    return annuityValue * (1 + inflationRate / 100) ** (year - currentAge);
  });
  const data = years.map((year, i) => ({
    year,
    desiredWithdrawals: desiredWithdrawals[i],
    actualWithdrawals: desiredWithdrawals[i],
    annuityValue: annuityValues[i] || 0,
  }));
  return (
    <ChartContainer config={config} className="w-full">
      <ComposedChart data={data} className="p-2">
        <XAxis
          dataKey="year"
          label={{
            value: "Age",
            position: "insideBottom",
            offset: -10,
          }}
          tickFormatter={(value) => value.toString()}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(value) =>
            new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) =>
            new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <CartesianGrid />
        <Line
          dataKey="annuityValue"
          stroke="var(--color-annuityValue)"
          yAxisId="left"
        />
        <Line
          dataKey="desiredWithdrawals"
          stroke="var(--color-desiredWithdrawals)"
          yAxisId="right"
        />
        <Line
          dataKey="actualWithdrawals"
          stroke="var(--color-actualWithdrawals)"
          yAxisId="right"
        />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
      </ComposedChart>
    </ChartContainer>
  );
}
