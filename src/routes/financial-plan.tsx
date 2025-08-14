import { createFileRoute } from "@tanstack/react-router";
import { NetWorthChart } from "@/components/net-worth-chart";
import { FinancialPlanSimulation } from "@/components/financial-plan/financial-plan-simulation";

export const Route = createFileRoute("/financial-plan")({
  component: RouteComponent,
});

function RouteComponent() {
  const { npv = true } = Route.useSearch();
  return (
    <div className="flex flex-col gap-4 p-4">
      <FinancialPlanSimulation />
      <NetWorthChart npv={npv} />
    </div>
  );
}
