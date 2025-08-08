import { ResponsiveContainer } from "recharts";
import { Sankey } from "recharts";
import { Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/store";

export function MoneyMap() {
  const incomes = useStore((state) => state.incomes);
  const expenses = useStore((state) => state.expenses);
  const assets = useStore((state) => state.assets);
  const liabilities = useStore((state) => state.liabilities);

  // Calculate monthly budget surplus/deficit
  const totalMonthlyIncome = incomes.reduce((sum, income) => sum + income.value, 0);
  const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const totalMonthlyAssetContributions = assets.reduce((sum, asset) => sum + asset.monthlyContribution, 0);
  const totalMonthlyLiabilityPayments = liabilities.reduce((sum, liability) => sum + liability.monthlyPayment, 0);

  const monthlyBudgetSurplus = totalMonthlyIncome - totalMonthlyExpenses - totalMonthlyAssetContributions - totalMonthlyLiabilityPayments;

  // Format the result
  const formattedAmount = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(Math.abs(monthlyBudgetSurplus));

  const getBudgetText = () => {
    if (monthlyBudgetSurplus > 0) {
      return `Monthly Budget Surplus: ${formattedAmount}`;
    } else if (monthlyBudgetSurplus < 0) {
      return `Monthly Budget Deficit: ${formattedAmount}`;
    } else {
      return `Balanced Monthly Budget: ${formattedAmount}`;
    }
  };

  const getTextColor = () => {
    if (monthlyBudgetSurplus > 0) {
      return "text-green-600";
    } else if (monthlyBudgetSurplus < 0) {
      return "text-red-600";
    } else {
      return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className={`${getTextColor()} text-center`}>
            {getBudgetText()}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="gap-0 flex-1 w-full">
        <CardContent>
          <ResponsiveContainer
            height={400}
            width="100%"
          >
            <Sankey
              data={{
                links: [
                  {
                    source: 0,
                    target: 1,
                    value: 3728.3
                  },
                  {
                    source: 0,
                    target: 2,
                    value: 354170
                  },
                  {
                    source: 2,
                    target: 3,
                    value: 291741
                  },
                  {
                    source: 2,
                    target: 4,
                    value: 62429
                  }
                ],
                nodes: [
                  {
                    name: 'Visit'
                  },
                  {
                    name: 'Direct-Favourite'
                  },
                  {
                    name: 'Page-Click'
                  },
                  {
                    name: 'Detail-Favourite'
                  },
                  {
                    name: 'Lost'
                  }
                ]
              }}
            >
              <Tooltip />
            </Sankey>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}