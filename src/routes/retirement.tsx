import { createFileRoute } from "@tanstack/react-router";
import { RetirementCalculator } from "@/components/retirement-calculator";
import { z } from "zod";

const searchSchema = z.object({
  currentAge: z.coerce.number().optional().default(50),
  retirementAge: z.coerce.number().optional().default(65),
  numYearsRequired: z.coerce.number().optional().default(20),
  monthlyWithdrawal: z.coerce.number().optional().default(10000),
  interestRate: z.coerce.number().optional().default(7),
  inflationRate: z.coerce.number().optional().default(5),
  lumpsumRemaining: z.coerce.number().optional().default(60000),
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
