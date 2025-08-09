import { createFileRoute } from "@tanstack/react-router";
import { NetWorthChart } from "@/components/net-worth-chart";

export const Route = createFileRoute("/financial-plan")({
  component: RouteComponent,
});

function RouteComponent() {
  const { npv = true } = Route.useSearch();
  return <NetWorthChart npv={npv} />;
}
