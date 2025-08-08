import { ResponsiveContainer } from "recharts";
import { Sankey } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
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

  // Prepare Sankey data
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Create a simple test data structure first
  let sankeyData;

  if (incomes.length === 0 && expenses.length === 0 && assets.length === 0 && liabilities.length === 0) {
    // Show sample data when no real data exists
    sankeyData = {
      nodes: [
        { name: "Sample Income\nR 10,000", fill: "#10b981" },
        { name: "Total Budget\nR 10,000", fill: "#3b82f6" },
        { name: "Sample Expense\nR 6,000", fill: "#f59e0b" },
        { name: "Sample Asset\nR 3,000", fill: "#8b5cf6" },
        { name: "Budget Surplus\nR 1,000", fill: "#059669" }
      ],
      links: [
        { source: 0, target: 1, value: 10000 },
        { source: 1, target: 2, value: 6000 },
        { source: 1, target: 3, value: 3000 },
        { source: 1, target: 4, value: 1000 }
      ]
    };
  } else {
    // Build nodes array
    const nodes = [];
    const links = [];

    // First column: Individual incomes + deficit node if needed
    let nodeIndex = 0;
    const incomeNodeIndices: number[] = [];

    incomes.forEach((income) => {
      if (income.value > 0) {
        nodes.push({
          name: `${income.name}\n${formatCurrency(income.value)}`,
          fill: "#10b981" // Green for income
        });
        incomeNodeIndices.push(nodeIndex);
        nodeIndex++;
      }
    });

    // Add deficit node in first column if needed
    let deficitNodeIndex = -1;
    if (monthlyBudgetSurplus < 0) {
      nodes.push({
        name: `Budget Deficit\n${formatCurrency(Math.abs(monthlyBudgetSurplus))}`,
        fill: "#ef4444" // Red for deficit
      });
      deficitNodeIndex = nodeIndex;
      nodeIndex++;
    }

    // Second column: Combined budget node
    const budgetNodeIndex = nodeIndex;
    nodes.push({
      name: `Total Budget\n${formatCurrency(totalMonthlyIncome)}`,
      fill: "#3b82f6" // Blue for budget
    });
    nodeIndex++;

    // Third column: Individual expenses, assets, liabilities + surplus node if needed
    const outflowNodeIndices: number[] = [];

    // Add expenses
    expenses.forEach((expense) => {
      if (expense.value > 0) {
        nodes.push({
          name: `${expense.name}\n${formatCurrency(expense.value)}`,
          fill: "#f59e0b" // Orange for expenses
        });
        outflowNodeIndices.push(nodeIndex);
        nodeIndex++;
      }
    });

    // Add asset contributions
    assets.forEach((asset) => {
      if (asset.monthlyContribution > 0) {
        nodes.push({
          name: `${asset.name}\n${formatCurrency(asset.monthlyContribution)}`,
          fill: "#8b5cf6" // Purple for assets
        });
        outflowNodeIndices.push(nodeIndex);
        nodeIndex++;
      }
    });

    // Add liability payments
    liabilities.forEach((liability) => {
      if (liability.monthlyPayment > 0) {
        nodes.push({
          name: `${liability.name}\n${formatCurrency(liability.monthlyPayment)}`,
          fill: "#dc2626" // Red for liabilities
        });
        outflowNodeIndices.push(nodeIndex);
        nodeIndex++;
      }
    });

    // Add surplus node in third column if needed
    let surplusNodeIndex = -1;
    if (monthlyBudgetSurplus > 0) {
      nodes.push({
        name: `Budget Surplus\n${formatCurrency(monthlyBudgetSurplus)}`,
        fill: "#059669" // Dark green for surplus
      });
      surplusNodeIndex = nodeIndex;
      outflowNodeIndices.push(nodeIndex);
    }

    // Build links from first column to budget
    incomeNodeIndices.forEach((incomeIndex) => {
      const income = incomes[incomeIndex - (deficitNodeIndex >= 0 && incomeIndex > deficitNodeIndex ? 1 : 0)];
      if (income && income.value > 0) {
        links.push({
          source: incomeIndex,
          target: budgetNodeIndex,
          value: income.value,
          formattedValue: formatCurrency(income.value)
        });
      }
    });

    // Add deficit link if needed
    if (deficitNodeIndex >= 0) {
      links.push({
        source: deficitNodeIndex,
        target: budgetNodeIndex,
        value: Math.abs(monthlyBudgetSurplus),
        formattedValue: formatCurrency(Math.abs(monthlyBudgetSurplus))
      });
    }

    // Build links from budget to third column
    let linkIndex = 0;

    // Distribute budget to expenses
    expenses.forEach((expense) => {
      if (expense.value > 0) {
        links.push({
          source: budgetNodeIndex,
          target: outflowNodeIndices[linkIndex],
          value: expense.value,
          formattedValue: formatCurrency(expense.value)
        });
        linkIndex++;
      }
    });

    // Distribute budget to asset contributions
    assets.forEach((asset) => {
      if (asset.monthlyContribution > 0) {
        links.push({
          source: budgetNodeIndex,
          target: outflowNodeIndices[linkIndex],
          value: asset.monthlyContribution,
          formattedValue: formatCurrency(asset.monthlyContribution)
        });
        linkIndex++;
      }
    });

    // Distribute budget to liability payments
    liabilities.forEach((liability) => {
      if (liability.monthlyPayment > 0) {
        links.push({
          source: budgetNodeIndex,
          target: outflowNodeIndices[linkIndex],
          value: liability.monthlyPayment,
          formattedValue: formatCurrency(liability.monthlyPayment)
        });
        linkIndex++;
      }
    });

    // Add surplus link if needed
    if (surplusNodeIndex >= 0) {
      links.push({
        source: budgetNodeIndex,
        target: surplusNodeIndex,
        value: monthlyBudgetSurplus,
        formattedValue: formatCurrency(monthlyBudgetSurplus)
      });
    }

    sankeyData = {
      nodes,
      links
    };
  }

  console.log("Sankey data:", sankeyData); // Debug log

  // Custom node component to render labels and colors
  const CustomNode = (props: any) => {
    const { x, y, width, height, index } = props;
    const node = sankeyData.nodes[index];

    return (
      <g>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={node.fill}
                stroke="#fff"
                strokeWidth={2}
                rx={4}
                ry={4}
                style={{ cursor: 'pointer' }}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-white border shadow-lg">
              <p className="font-medium text-gray-900">
                {node.name.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i < node.name.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </g>
    );
  };

  // Color legend data
  const colorLegend = [
    { color: "#10b981", label: "Income Sources" },
    { color: "#3b82f6", label: "Total Budget" },
    { color: "#f59e0b", label: "Expenses" },
    { color: "#8b5cf6", label: "Asset Contributions" },
    { color: "#dc2626", label: "Liability Payments" },
    { color: "#059669", label: "Budget Surplus" },
    { color: "#ef4444", label: "Budget Deficit" }
  ];

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
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Color Legend:</h3>
            <div className="flex flex-wrap gap-4">
              {colorLegend.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <div className="flex-1 text-center">Inflows</div>
              <div className="flex-1 text-center">Budget</div>
              <div className="flex-1 text-center">Outflows</div>
            </div>
          </div>

          <ResponsiveContainer
            height={400}
            width="100%"
          >
            <Sankey
              data={sankeyData}
              nodePadding={50}
              node={<CustomNode />}
            />
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}