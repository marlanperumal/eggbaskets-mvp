import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceSheet } from "@/components/balance-sheet";
import { IncomeStatement } from "@/components/income-statement";
import { NetWorthChart } from "@/components/net-worth-chart";
// import { ProfitChart } from "@/components/profit-chart";
// import { LiquidityChart } from "@/components/liquidity-chart";
import { TopBar } from "@/components/top-bar";
import { Goals } from "@/components/goals";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <TopBar />
      <main className="flex-1 flex flex-row items-stretch w-full">
        <div className="p-2 w-1/2 min-w-0">
          <Tabs className="mb-2" defaultValue="balance-sheet">
            <TabsList className="w-full">
              <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
              <TabsTrigger value="income-statement">
                Income Statement
              </TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="balance-sheet">
              <BalanceSheet />
            </TabsContent>
            <TabsContent value="income-statement">
              <IncomeStatement />
            </TabsContent>
            <TabsContent value="goals">
              <Goals />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/2 min-w-0 flex flex-col p-2 gap-1">
          <NetWorthChart />
          {/* <ProfitChart />
          <LiquidityChart /> */}
        </div>
      </main>
    </div>
  );
}
