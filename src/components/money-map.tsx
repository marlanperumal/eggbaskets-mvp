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

  // Calculate annual budget surplus/deficit (convert monthly to annual)
  const totalAnnualIncome = incomes.reduce((sum, income) => sum + income.value * 12, 0);
  const totalAnnualExpenses = expenses.reduce((sum, expense) => sum + expense.value * 12, 0);
  const totalAnnualAssetContributions = assets.reduce((sum, asset) => sum + asset.monthlyContribution * 12, 0);
  const totalAnnualLiabilityPayments = liabilities.reduce((sum, liability) => sum + liability.monthlyPayment * 12, 0);

  const annualBudgetSurplus = totalAnnualIncome - totalAnnualExpenses - totalAnnualAssetContributions - totalAnnualLiabilityPayments;

  // Format the result
  const formattedAmount = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(Math.abs(annualBudgetSurplus));

  const getBudgetText = () => {
    if (annualBudgetSurplus > 0) {
      return `Annual Budget Surplus: ${formattedAmount}`;
    } else if (annualBudgetSurplus < 0) {
      return `Annual Budget Deficit: ${formattedAmount}`;
    } else {
      return `Balanced Annual Budget: ${formattedAmount}`;
    }
  };

  const getTextColor = () => {
    if (annualBudgetSurplus > 0) {
      return "text-green-600";
    } else if (annualBudgetSurplus < 0) {
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
        { name: "Sample Income\nR 120,000", fill: "#10b981" },
        { name: "Total Budget\nR 120,000", fill: "#3b82f6" },
        { name: "Sample Expense\nR 72,000", fill: "#f59e0b" },
        { name: "Sample Asset\nR 36,000", fill: "#8b5cf6" },
        { name: "Budget Surplus\nR 12,000", fill: "#059669" }
      ],
      links: [
        { source: 0, target: 1, value: 120000 },
        { source: 1, target: 2, value: 72000 },
        { source: 1, target: 3, value: 36000 },
        { source: 1, target: 4, value: 12000 }
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
          name: `${income.name}\n${formatCurrency(income.value * 12)}`,
          fill: "#10b981" // Green for income
        });
        incomeNodeIndices.push(nodeIndex);
        nodeIndex++;
      }
    });

    // Add deficit node in first column if needed
    let deficitNodeIndex = -1;
    if (annualBudgetSurplus < 0) {
      nodes.push({
        name: `Budget Deficit\n${formatCurrency(Math.abs(annualBudgetSurplus))}`,
        fill: "#ef4444" // Red for deficit
      });
      deficitNodeIndex = nodeIndex;
      nodeIndex++;
    }

    // Second column: Combined budget node
    const budgetNodeIndex = nodeIndex;
    nodes.push({
      name: `Total Budget\n${formatCurrency(totalAnnualIncome)}`,
      fill: "#3b82f6" // Blue for budget
    });
    nodeIndex++;

    // Third column: Individual expenses, assets, liabilities + surplus node if needed
    const outflowNodeIndices: number[] = [];

    // Add expenses
    expenses.forEach((expense) => {
      if (expense.value > 0) {
        nodes.push({
          name: `${expense.name}\n${formatCurrency(expense.value * 12)}`,
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
          name: `${asset.name}\n${formatCurrency(asset.monthlyContribution * 12)}`,
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
          name: `${liability.name}\n${formatCurrency(liability.monthlyPayment * 12)}`,
          fill: "#dc2626" // Red for liabilities
        });
        outflowNodeIndices.push(nodeIndex);
        nodeIndex++;
      }
    });

    // Add surplus node in third column if needed
    let surplusNodeIndex = -1;
    if (annualBudgetSurplus > 0) {
      nodes.push({
        name: `Budget Surplus\n${formatCurrency(annualBudgetSurplus)}`,
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
          value: income.value * 12,
          formattedValue: formatCurrency(income.value * 12)
        });
      }
    });

    // Add deficit link if needed
    if (deficitNodeIndex >= 0) {
      links.push({
        source: deficitNodeIndex,
        target: budgetNodeIndex,
        value: Math.abs(annualBudgetSurplus),
        formattedValue: formatCurrency(Math.abs(annualBudgetSurplus))
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
          value: expense.value * 12,
          formattedValue: formatCurrency(expense.value * 12)
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
          value: asset.monthlyContribution * 12,
          formattedValue: formatCurrency(asset.monthlyContribution * 12)
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
          value: liability.monthlyPayment * 12,
          formattedValue: formatCurrency(liability.monthlyPayment * 12)
        });
        linkIndex++;
      }
    });

    // Add surplus link if needed
    if (surplusNodeIndex >= 0) {
      links.push({
        source: budgetNodeIndex,
        target: surplusNodeIndex,
        value: annualBudgetSurplus,
        formattedValue: formatCurrency(annualBudgetSurplus)
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
    const nodeNumber = index + 1;

    return (
      <g>
        {/* Node number label */}
        <circle
          cx={x + width / 2}
          cy={y - 10}
          r={12}
          fill="white"
          stroke="#374151"
          strokeWidth={2}
        />
        <text
          x={x + width / 2}
          y={y - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight="bold"
          fill="#374151"
        >
          {nodeNumber}
        </text>

        {/* Node rectangle */}
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

  // Create reference table data
  const referenceTableData = sankeyData.nodes.map((node: any, index: number) => {
    const nodeNumber = index + 1;
    const [name, value] = node.name.split('\n');

    return {
      number: nodeNumber,
      color: node.fill,
      name,
      value
    };
  });

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
          <div className="mb-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <div className="flex-1 text-center">Inflows</div>
              <div className="flex-1 text-center">Budget</div>
              <div className="flex-1 text-center">Outflows</div>
            </div>
          </div>

          <ResponsiveContainer
            height={450}
            width="100%"
          >
            <Sankey
              data={sankeyData}
              nodePadding={50}
              node={<CustomNode />}
              margin={{ top: 30, right: 20, bottom: 20, left: 20 }}
            />
          </ResponsiveContainer>

          <div className="mt-4 mb-6">
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

          {/* Reference Table */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Node Reference:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="text-right py-2 px-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {referenceTableData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.number}
                        </div>
                      </td>
                      <td className="py-2 px-2 font-medium">{item.name}</td>
                      <td className="py-2 px-2 text-right font-medium">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}