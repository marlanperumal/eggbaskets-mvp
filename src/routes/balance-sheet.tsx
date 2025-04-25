import { createFileRoute } from "@tanstack/react-router";
import { BalanceSheet } from "@/components/balance-sheet";
import { NetWorthChart } from "@/components/net-worth-chart";

export const Route = createFileRoute("/balance-sheet")({
  component: RouteComponent,
});

function RouteComponent() {
  const { npv = true } = Route.useSearch();
  return (
    <div className="flex flex-row gap-2 p-2">
      <BalanceSheet />
      <NetWorthChart npv={npv} />
    </div>
  );
}
