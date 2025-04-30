import { createFileRoute } from "@tanstack/react-router";
import { RetirementCalculator } from "@/components/retirement-calculator";
import { z } from "zod";

const searchSchema = z.object({
  currentAge: z.coerce.number().optional(),
  retirementAge: z.coerce.number().optional(),
  numYearsRequired: z.coerce.number().optional(),
  monthlyWithdrawal: z.coerce.number().optional(),
  interestRate: z.coerce.number().optional(),
  inflationRate: z.coerce.number().optional(),
  lumpsumRemaining: z.coerce.number().optional(),
});

export type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/retirement")({
  validateSearch: searchSchema,
  component: RetirementRoute,
});

function RetirementRoute() {
  return (
    <div className="flex flex-row gap-2 p-2">
      <RetirementCalculator />
    </div>
  );
}
