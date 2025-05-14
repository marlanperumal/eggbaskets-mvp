import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const config = {
  withdrawals: {
    label: "Withdrawals",
    color: "hsl(217.2 91.2% 59.8%)",
  },
  annuityValue: {
    label: "Annuity Value",
    color: "hsl(0 84.2% 60.2%)",
  },
} satisfies ChartConfig;

export function RetirementResultChart() {
  const data = [
    {
      year: 2025,
      withdrawals: 10000,
      annuityValue: 100000,
    },
    {
      year: 2026,
      withdrawals: 10000,
      annuityValue: 100000,
    },
  ];
  return (
    <ChartContainer config={config} className="w-full">
      <LineChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <CartesianGrid />
        <Line dataKey="withdrawals" stroke="var(--color-withdrawals)" />
        <Line dataKey="annuityValue" stroke="var(--color-annuityValue)" />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}
