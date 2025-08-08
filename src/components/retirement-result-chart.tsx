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
    label: "Actual Monthly Withdrawals",
    color: "hsl(217.2 91.2% 59.8%)",
  },
  desiredWithdrawals: {
    label: "Desired Monthly Withdrawals",
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
    npv,
  } = searchParams;

  if (
    !(currentAge! > 0) ||
    !(retirementAge! > 0) ||
    !(numYearsRequired! > 0) ||
    !(monthlyWithdrawal! > 0) ||
    !(interestRate! > 0) ||
    !(inflationRate! > 0) ||
    !(lumpsumRemaining! > -1)
  ) {
    return null;
  }

  const realInterestRate =
    (1 + interestRate / 100) / (1 + inflationRate / 100) - 1;
  const presentAnnualWithdrawal = monthlyWithdrawal * 12;
  const npvFactor = npv ? 0 : inflationRate / 100;
  const annuityPrincipal =
    (presentAnnualWithdrawal *
      (1 - (1 + realInterestRate) ** -numYearsRequired)) /
    realInterestRate +
    lumpsumRemaining / (1 + realInterestRate) ** numYearsRequired;
  const years = Array.from(
    { length: numYearsRequired + 1 },
    (_, i) => i + retirementAge
  );

  let annuityValue = annuityPrincipal;
  let desiredWithdrawal = presentAnnualWithdrawal;
  let actualWithdrawal = Math.min(desiredWithdrawal, annuityValue * 0.175);

  const annuityValues = [annuityValue];
  const desiredWithdrawals = [desiredWithdrawal];
  const actualWithdrawals = [actualWithdrawal];

  for (let i = 1; i < years.length; i++) {
    annuityValue = annuityValue * (1 + realInterestRate) - actualWithdrawal;
    actualWithdrawal = Math.min(desiredWithdrawal, annuityValue * 0.175);
    annuityValues.push(annuityValue);
    desiredWithdrawals.push(desiredWithdrawal);
    actualWithdrawals.push(actualWithdrawal);
  }
  const data = years.map((year, i) => ({
    year,
    desiredWithdrawals:
      (desiredWithdrawals[i] / 12) * (1 + npvFactor) ** (year - currentAge),
    actualWithdrawals:
      (actualWithdrawals[i] / 12) * (1 + npvFactor) ** (year - currentAge),
    annuityValue: annuityValues[i] * (1 + npvFactor) ** (year - currentAge),
  }));

  return (
    <ChartContainer config={config} className="w-full h-full">
      <ComposedChart data={data}>
        <XAxis
          dataKey="year"
          label={{
            value: "Age",
            position: "insideBottom",
            offset: -4,
          }}
          tickFormatter={(value) => value.toString()}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(value) =>
            `R ${(value / 1000000).toFixed(1)}M`
          }
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) =>
            `R ${(value / 1000).toFixed(1)}k`
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
          formatter={(value: number, name: string) => [
            new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
              maximumFractionDigits: 0,
            }).format(value),
            config[name as keyof typeof config].label,
          ]}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </ComposedChart>
    </ChartContainer>
  );
}
