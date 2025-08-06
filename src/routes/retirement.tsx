import { createFileRoute } from "@tanstack/react-router";
import { RetirementCalculator } from "@/components/retirement-calculator";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";

const searchSchema = z.object({
  currentAge: z.coerce.number().optional().default(50),
  retirementAge: z.coerce.number().optional().default(65),
  numYearsRequired: z.coerce.number().optional().default(20),
  monthlyWithdrawal: z.coerce.number().optional().default(10000),
  interestRate: z.coerce.number().optional().default(7),
  inflationRate: z.coerce.number().optional().default(5),
  lumpsumRemaining: z.coerce.number().optional().default(700000),
});

export type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/retirement")({
  validateSearch: searchSchema,
  component: RetirementRoute,
});

function RetirementRoute() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <Card>
        <CardContent>
          <p className="text-sm text-center">
            Let's start with the probably the biggest financial goal for most
            people: Retirement. <br />
            The most basic way to achieve this is with a retirement savings plan
            like a Pension, Provident Fund or Retirement Annuity. But how much
            do you need to save?
            <br />
            Here we'll calculate what you'll need to buy a Living Annuity that
            will provide you with a monthly income for the rest of your life.
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-2">
        <RetirementCalculator />
      </div>
    </div>
  );
}
