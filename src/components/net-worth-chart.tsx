import {
  Area,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";
import { useStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function NetWorthChart({ npv = true }: { npv?: boolean }) {
  const showNpv = npv;
  const inflationRate = 5;
  const assets = useStore((state) => state.assets);
  const liabilities = useStore((state) => state.liabilities);
  const incomes = useStore((state) => state.incomes);
  const expenses = useStore((state) => state.expenses);
  const goals = useStore((state) => state.goals);

  const startYear = 2025;
  const numPeriods = 30;
  const tickWidth = 5;
  const numTicks = numPeriods / tickWidth + 1;
  const ticks = Array.from({ length: numTicks }, (_, i) => {
    return startYear + i * tickWidth;
  });

  // Generate colors for individual series
  // Assets: Green/blue tones (positive values)
  // Liabilities: Red/orange tones (negative values) 
  // Goals: Yellow/green tones (expenses)
  const generateColors = (count: number, baseHue: number) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = (baseHue + i * 30) % 360;
      return `hsl(${hue}, 70%, 60%)`;
    });
  };

  const assetColors = generateColors(
    assets.filter((a) => a.id !== "current-account").length,
    217
  );
  const liabilityColors = generateColors(liabilities.length, 0); // Red/orange tones for liabilities
  const goalColors = generateColors(goals.length, 120);

  // Create dynamic config for individual series
  const createConfig = () => {
    const config: ChartConfig = {};

    // Add current account
    config.asset_current_account = {
      label: "Current Account",
      color: "hsl(120, 70%, 60%)", // Green color for cash
    };

    // Add individual assets (excluding current account)
    assets
      .filter((asset) => asset.id !== "current-account")
      .forEach((asset, index) => {
        config[`asset_${asset.id}`] = {
          label: asset.name,
          color: assetColors[index],
        };
      });

    // Add individual liabilities (negative values)
    liabilities.forEach((liability, index) => {
      config[`liability_${liability.id}`] = {
        label: `${liability.name} (Liability)`,
        color: liabilityColors[index],
      };
    });

    // Add individual goals
    goals.forEach((goal, index) => {
      config[`goal_${goal.id}`] = {
        label: goal.name,
        color: goalColors[index],
      };
    });

    // Add net worth line
    config.netWorth = {
      label: "Net Worth",
      color: "hsl(0 0% 0%)",
    };

    return config;
  };

  const config = createConfig();

  const netWorthData = Array.from({ length: numPeriods + 1 }, (_, i) => {
    const year = startYear + i;
    const dataPoint: any = { date: year.toString() };

    let totalAssets = 0;
    let totalLiabilities = 0;
    let currentAccountValue = 0;

    // Calculate budget surplus/deficit for this year
    const annualIncome = incomes.reduce((sum, income) => {
      if (
        income.startYear <= year &&
        (income.endYear === undefined || income.endYear >= year)
      ) {
        const yearsOfGrowth = year - income.startYear;
        return (
          sum +
          income.value *
          12 *
          Math.pow(1 + income.annualGrowthRate / 100, yearsOfGrowth)
        );
      }
      return sum;
    }, 0);

    const annualExpenses = expenses.reduce((sum, expense) => {
      if (
        expense.startYear <= year &&
        (expense.endYear === undefined || expense.endYear >= year)
      ) {
        const yearsOfGrowth = year - expense.startYear;
        return (
          sum +
          expense.value *
          12 *
          Math.pow(1 + expense.annualGrowthRate / 100, yearsOfGrowth)
        );
      }
      return sum;
    }, 0);

    // Calculate asset contributions and liability payments for budget
    const assetContributions = assets.reduce((sum, asset) => {
      if (
        asset.startYear <= year &&
        (asset.endYear === undefined || asset.endYear >= year)
      ) {
        return sum + asset.monthlyContribution * 12;
      }
      return sum;
    }, 0);

    const liabilityPayments = liabilities.reduce((sum, liability) => {
      if (liability.startYear <= year) {
        // Stop payments if liability has reached its term
        const liabilityEndYear =
          liability.startYear + liability.termInMonths / 12;
        if (year <= liabilityEndYear) {
          return sum + liability.monthlyPayment * 12;
        }
      }
      return sum;
    }, 0);

    const budgetSurplus =
      annualIncome - annualExpenses - assetContributions - liabilityPayments;

    // Calculate current account value for this year
    // Start with the initial current account value from the store
    const initialCurrentAccount =
      assets.find((a) => a.id === "current-account")?.value || 0;

    // Calculate cumulative budget surplus/deficit up to this year
    let cumulativeBudgetSurplus = 0;
    for (let y = startYear; y <= year; y++) {
      const yearIncome = incomes.reduce((sum, income) => {
        if (
          income.startYear <= y &&
          (income.endYear === undefined || income.endYear >= y)
        ) {
          const yearsOfGrowth = y - income.startYear;
          return (
            sum +
            income.value *
            12 *
            Math.pow(1 + income.annualGrowthRate / 100, yearsOfGrowth)
          );
        }
        return sum;
      }, 0);

      const yearExpenses = expenses.reduce((sum, expense) => {
        if (
          expense.startYear <= y &&
          (expense.endYear === undefined || expense.endYear >= y)
        ) {
          const yearsOfGrowth = y - expense.startYear;
          return (
            sum +
            expense.value *
            12 *
            Math.pow(1 + expense.annualGrowthRate / 100, yearsOfGrowth)
          );
        }
        return sum;
      }, 0);

      const yearAssetContributions = assets.reduce((sum, asset) => {
        if (
          asset.startYear <= y &&
          (asset.endYear === undefined || asset.endYear >= y)
        ) {
          return sum + asset.monthlyContribution * 12;
        }
        return sum;
      }, 0);

      const yearLiabilityPayments = liabilities.reduce((sum, liability) => {
        if (liability.startYear <= y) {
          const liabilityEndYear =
            liability.startYear + liability.termInMonths / 12;
          if (y <= liabilityEndYear) {
            return sum + liability.monthlyPayment * 12;
          }
        }
        return sum;
      }, 0);

      cumulativeBudgetSurplus +=
        yearIncome -
        yearExpenses -
        yearAssetContributions -
        yearLiabilityPayments;
    }

    // Subtract goals from previous years
    let previousGoalsValue = 0;
    for (let y = startYear; y < year; y++) {
      goals.forEach((goal) => {
        if (goal.startYear === y) {
          previousGoalsValue += goal.value;
        }
      });
    }

    currentAccountValue =
      initialCurrentAccount +
      cumulativeBudgetSurplus -
      previousGoalsValue;

    // Add budget surplus/deficit to current account for this year
    currentAccountValue += budgetSurplus;

    // Process each asset
    // Assets that have reached their end year are converted to cash and added to current account
    // Active assets continue to grow and contribute to total assets
    assets.forEach((asset) => {
      if (asset.startYear <= year) {
        const yearsOfInterest = year - asset.startYear;
        let assetValue = 0;

        if (asset.endYear && year > asset.endYear) {
          // Asset has ended, convert to cash
          const endYearValue =
            asset.value *
            Math.pow(
              1 + asset.annualGrowthRate / 100,
              asset.endYear - asset.startYear
            );
          const contributionsToEnd =
            asset.monthlyContribution * 12 * (asset.endYear - asset.startYear);
          assetValue = endYearValue + contributionsToEnd;

          // Add the converted asset value to current account for this year
          // This represents the cash that was converted from the asset
          currentAccountValue += assetValue;

          // Debug logging for asset conversion
          if (year === 2026) { // Only log for a specific year to avoid spam
            console.log(`Asset ${asset.name} converted to cash:`, {
              asset: asset.name,
              year,
              endYear: asset.endYear,
              endYearValue,
              contributionsToEnd,
              assetValue,
              currentAccountValue
            });
          }

          // Don't add to totalAssets since it's now cash
          // Don't set dataPoint since it's converted to cash
        } else if (asset.endYear === undefined || asset.endYear >= year) {
          // Asset is still active
          const principalWithInterest =
            asset.value *
            Math.pow(1 + asset.annualGrowthRate / 100, yearsOfInterest);

          const annualContributionWithInterest = asset.monthlyContribution
            ? asset.annualGrowthRate === 0
              ? asset.monthlyContribution * 12 * yearsOfInterest
              : asset.monthlyContribution *
              12 *
              ((Math.pow(1 + asset.annualGrowthRate / 100, yearsOfInterest) -
                1) /
                (asset.annualGrowthRate / 100))
            : 0;

          assetValue = principalWithInterest + annualContributionWithInterest;
          totalAssets += assetValue;
          dataPoint[`asset_${asset.id}`] = assetValue;
        }
      }
    });

    // After processing all assets, add the current account value to total assets
    // This includes the initial value, budget surplus/deficit, and any converted assets
    totalAssets += currentAccountValue;
    dataPoint.asset_current_account = currentAccountValue;

    // Debug logging for current account
    if (year === 2026) { // Only log for a specific year to avoid spam
      console.log(`Current account calculation for year ${year}:`, {
        initialCurrentAccount,
        cumulativeBudgetSurplus,
        previousGoalsValue,
        budgetSurplus,
        currentAccountValue,
        totalAssets
      });
    }

    // Process each liability
    liabilities.forEach((liability) => {
      if (liability.startYear <= year) {
        const yearsOfInterest = year - liability.startYear;
        let liabilityValue = 0;

        const principalWithInterest =
          liability.value *
          Math.pow(1 + liability.interestRate / 100, yearsOfInterest);

        // Calculate payments made
        const liabilityEndYear =
          liability.startYear + liability.termInMonths / 12;
        let totalPayments = 0;

        if (year <= liabilityEndYear) {
          // Still making payments
          totalPayments = liability.monthlyPayment * 12 * yearsOfInterest;
        } else {
          // Payments stopped, but liability continues earning interest
          totalPayments =
            liability.monthlyPayment *
            12 *
            (liabilityEndYear - liability.startYear);
        }

        liabilityValue = principalWithInterest - totalPayments;
        // Ensure liability is always negative for net worth calculation
        const negativeLiabilityValue = -Math.abs(liabilityValue);
        totalLiabilities += negativeLiabilityValue;
        dataPoint[`liability_${liability.id}`] = negativeLiabilityValue; // Negative for display
      }
    });

    // Process goals and reduce current account
    goals.forEach((goal) => {
      if (goal.startYear === year) {
        // Goal occurs this year
        let goalValue = goal.value;

        // If NPV is disabled, convert the stored NPV value to future value
        if (!showNpv) {
          const yearsFromGoal = year - startYear;
          goalValue =
            goal.value * Math.pow(1 + inflationRate / 100, yearsFromGoal);
        }
        // If NPV is enabled, use the stored NPV value directly (no additional discounting)

        currentAccountValue -= goalValue; // Reduce current account
        dataPoint[`goal_${goal.id}`] = -goalValue; // Negative for display as bar
      }
    });

    // Calculate net worth (assets minus liabilities)
    // totalAssets includes:
    // - Active assets (growing with interest and contributions)
    // - Current account (initial value + budget surplus/deficit + converted assets)
    // totalLiabilities includes all negative liability values
    // So netWorth = totalAssets + totalLiabilities = totalAssets - |totalLiabilities|
    const netWorth = totalAssets + totalLiabilities; // totalLiabilities is already negative
    dataPoint.netWorth = netWorth;

    // Apply NPV factor
    const yearsFromStart = year - startYear;
    const npvFactor = !showNpv
      ? 1
      : 1 / Math.pow(1 + inflationRate / 100, yearsFromStart);

    // Apply NPV to all values
    Object.keys(dataPoint).forEach((key) => {
      if (key !== "date" && typeof dataPoint[key] === "number") {
        // Don't apply NPV to goals since they're handled separately
        if (!key.startsWith("goal_")) {
          dataPoint[key] *= npvFactor;
        }
      }
    });

    return dataPoint;
  });

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Net Worth (Assets - Liabilities)</CardTitle>
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
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <CartesianGrid />
            <Tooltip
              formatter={(value: any, name: string) => [
                new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                  maximumFractionDigits: 0,
                }).format(value),
                config[name as keyof typeof config]?.label || name,
              ]}
            />

            {/* Render current account area */}
            <Area
              dataKey="asset_current_account"
              fill="var(--color-asset_current_account)"
              stroke="var(--color-asset_current_account)"
              isAnimationActive={false}
              stackId="assets"
            />

            {/* Render individual asset areas */}
            {assets
              .filter((asset) => asset.id !== "current-account")
              .map((asset, index) => (
                <Area
                  key={`asset_${asset.id}`}
                  dataKey={`asset_${asset.id}`}
                  fill={assetColors[index]}
                  stroke={assetColors[index]}
                  isAnimationActive={false}
                  stackId="assets"
                />
              ))}

            {/* Render individual liability areas */}
            {liabilities.map((liability, index) => (
              <Area
                key={`liability_${liability.id}`}
                dataKey={`liability_${liability.id}`}
                fill={liabilityColors[index]}
                stroke={liabilityColors[index]}
                isAnimationActive={false}
                stackId="liabilities"
                fillOpacity={0.8}
              />
            ))}

            {/* Render individual goal bars */}
            {goals.map((goal, index) => (
              <Bar
                key={`goal_${goal.id}`}
                dataKey={`goal_${goal.id}`}
                fill={goalColors[index]}
                stroke={goalColors[index]}
                isAnimationActive={false}
              />
            ))}

            {/* Net worth line */}
            <Line
              dataKey="netWorth"
              fill="var(--color-netWorth)"
              stroke="var(--color-netWorth)"
              strokeWidth={3}
              type="monotone"
              dot={false}
              isAnimationActive={false}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
