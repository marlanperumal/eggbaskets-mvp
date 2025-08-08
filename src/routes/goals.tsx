import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { GoalsTable } from "@/components/goals/goals-table";
import { GoalsChart } from "@/components/goals/goals-chart";

export const Route = createFileRoute("/goals")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <Card>
        <CardContent>
          <p className="text-sm text-center">
            Next we'll set up some goals. These are the big things you're saving
            your money for.
            <br />
            These are things like buying a house, paying for a wedding, or
            saving for a child's education.
            <br />
            They can be once off or recurring amounts and need to be funded from
            your other financial assets.
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        <div className="md:basis-1/2 min-w-0 flex">
          <GoalsTable />
        </div>
        <div className="md:basis-1/2 min-w-0 flex">
          <GoalsChart />
        </div>
      </div>
    </div>
  );
}
