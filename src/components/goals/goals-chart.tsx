import { Card, CardContent } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Target, Building2, CreditCard } from "lucide-react";
import { useStore } from "@/store";
import { useSearch } from "@tanstack/react-router";

export function GoalsChart() {
  const goals = useStore((state) => state.goals);
  const search = useSearch({ from: "/goals" });
  const npv = search.npv ?? true; // Default to true (present value)
  const inflationRate = 0.05; // 5% inflation rate

  // Convert present value to future value based on year
  const convertToFutureValue = (presentValue: number, year: number) => {
    const currentYear = 2025;
    const yearsDiff = year - currentYear;
    return presentValue * Math.pow(1 + inflationRate, yearsDiff);
  };

  // Process goals data for the chart with type information
  const chartData = goals.reduce(
    (acc, goal) => {
      // For recurring goals, we need to account for multiple occurrences
      for (let i = 0; i < goal.numOccurrences; i++) {
        const year = goal.startYear + i * goal.recurrence;
        const existingYear = acc.find((item) => item.year === year);

        // Convert value based on npv parameter
        const adjustedValue = npv
          ? goal.value
          : convertToFutureValue(goal.value, year);

        if (existingYear) {
          // Add to existing year's data
          existingYear.value += adjustedValue;
          existingYear.goals.push({
            type: goal.type,
            value: adjustedValue,
            originalValue: goal.value,
            name: goal.name,
          });
        } else {
          acc.push({
            year,
            value: adjustedValue,
            goals: [
              {
                type: goal.type,
                value: adjustedValue,
                originalValue: goal.value,
                name: goal.name,
              },
            ],
          });
        }
      }
      return acc;
    },
    [] as Array<{
      year: number;
      value: number;
      goals: Array<{
        type: string;
        value: number;
        originalValue: number;
        name: string;
      }>;
    }>
  );

  // Sort by year
  chartData.sort((a, b) => a.year - b.year);

  // Create a complete year range from 2024 (one year before current) to the latest goal year
  const currentYear = 2025;
  const startYear = currentYear - 1; // Start one year before current
  const latestYear =
    chartData.length > 0
      ? Math.max(...chartData.map((d) => d.year))
      : currentYear;

  // Generate all years in the range
  const allYears = [];
  for (let year = startYear; year <= latestYear; year++) {
    allYears.push(year);
  }

  // Create complete chart data with all years (including years with 0 value)
  const completeChartData = allYears.map((year) => {
    const existingData = chartData.find((d) => d.year === year);
    return {
      year,
      value: existingData ? existingData.value : 0,
      goals: existingData ? existingData.goals : [],
    };
  });

  // Format the value for display
  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get icon for goal type
  const getGoalIcon = (type: string) => {
    switch (type) {
      case "Retirement":
        return <Target className="w-4 h-4" />;
      case "Asset":
        return <Building2 className="w-4 h-4" />;
      case "Expense":
        return <CreditCard className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Custom tooltip with icons
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">Year: {label}</p>
          <p className="text-sm text-muted-foreground">
            Total: {formatValue(data.value)}
            {!npv && <span className="text-xs"> (future value)</span>}
          </p>
          {data.goals.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Goals:</p>
              {data.goals.map((goal: any, index: number) => (
                <div key={index} className="flex items-center gap-2 mt-1">
                  {getGoalIcon(goal.type)}
                  <span className="text-sm">
                    {goal.name}: {formatValue(goal.value)}
                    {!npv && goal.originalValue !== goal.value && (
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        (was {formatValue(goal.originalValue)})
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex-1 min-w-0 w-full">
      <CardContent>
        {completeChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={completeChartData}
              margin={{ left: 10, right: 20, top: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                type="number"
                domain={[startYear, latestYear]}
                tick={{ fontSize: 12 }}
                label={{ value: "Year", position: "insideBottom", offset: -5 }}
                ticks={allYears}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: npv ? "Value (ZAR)" : "Future Value (ZAR)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                }}
                tickFormatter={(value) => formatValue(value)}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No goals data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
