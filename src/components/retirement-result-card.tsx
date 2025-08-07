import { Target } from "lucide-react";
import { useSearch } from "@tanstack/react-router";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route } from "@/routes/retirement";
import { useStore } from "@/store";
import { toast } from "sonner";

export function RetirementResultCard() {
  const searchParams = useSearch({ from: Route.fullPath });
  const addGoal = useStore((state) => state.addGoal);
  const {
    currentAge,
    retirementAge,
    numYearsRequired,
    monthlyWithdrawal,
    interestRate,
    inflationRate,
    lumpsumRemaining,
  } = searchParams;

  if (
    !(currentAge! > 0) ||
    !(retirementAge! > 0) ||
    !(numYearsRequired! > 0) ||
    !(monthlyWithdrawal! > 0) ||
    !(interestRate! > 0) ||
    !(inflationRate! > 0) ||
    !(lumpsumRemaining! > -1)
  ) {
    return null;
  }

  const yearsTillRetirement = retirementAge - currentAge;
  const annualWithdrawal = monthlyWithdrawal * 12;
  const realInterestRate =
    (1 + interestRate / 100) / (1 + inflationRate / 100) - 1;
  const presentValue =
    (annualWithdrawal * (1 - (1 + realInterestRate) ** -numYearsRequired)) /
      realInterestRate +
    lumpsumRemaining / (1 + realInterestRate) ** numYearsRequired;
  const futureValue =
    presentValue * (1 + inflationRate / 100) ** yearsTillRetirement;

  const handleAddToGoals = () => {
    const goal = {
      id: crypto.randomUUID() as string,
      name: "Save for Retirement",
      description: `Save ${new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
      }).format(
        presentValue
      )} (in today's money) by age ${retirementAge} to fund ${numYearsRequired} years of retirement with ${new Intl.NumberFormat(
        "en-ZA",
        {
          style: "currency",
          currency: "ZAR",
          maximumFractionDigits: 0,
        }
      ).format(annualWithdrawal)} annual withdrawal`,
      type: "Retirement" as const,
      value: Math.round(presentValue),
      startYear: 2025 + yearsTillRetirement,
      recurrence: 1,
      numOccurrences: 1,
      funded: false,
    };

    addGoal(goal);
    toast.success("Retirement goal created successfully!", {
      description: `Added "Save for Retirement" goal to your financial plan.`,
      classNames: {
        description: "!text-muted-foreground",
      },
    });
  };

  return (
    <>
      <CardHeader className="-mb-4">
        <CardTitle className="text-center">
          At retirement you will need{" "}
          <span className="text-lg font-bold">
            {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
              maximumFractionDigits: 0,
            }).format(futureValue)}{" "}
          </span>
          to purchase a living annuity to meet your requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <ul className="list-disc list-outside w-md pl-4">
          <li>
            This is the equivalent of{" "}
            <span className="text-md font-bold">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
                maximumFractionDigits: 0,
              }).format(presentValue)}
            </span>{" "}
            in today's money
          </li>
          <li>
            The real return on your living annuity investments after inflation
            is{" "}
            <span className="text-md font-bold">
              {interestRate - inflationRate}%
            </span>
          </li>
          <li>
            Your annual drawdown must be between{" "}
            <span className="text-md font-bold">2.5%</span> and{" "}
            <span className="text-md font-bold">17.5%</span> each year. After
            you hit this upper limit, the amount you're able to withdraw will
            start to decrease
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button className="cursor-pointer" onClick={handleAddToGoals}>
          <Target className="w-4 h-4" />
          Add to your Goals
        </Button>
      </CardFooter>
    </>
  );
}
