import { createFileRoute } from "@tanstack/react-router";
import { RetirementCalculator } from "@/components/retirement-calculator";

export const Route = createFileRoute("/retirement")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row gap-2 p-2">
      <RetirementCalculator />
    </div>
  );
}
