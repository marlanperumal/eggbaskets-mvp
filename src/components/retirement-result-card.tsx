import { Target } from "lucide-react";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route } from "@/routes/retirement";
import { Route as GoalsRoute } from "@/routes/goals";
import { Link, useSearch } from "@tanstack/react-router";

export function RetirementResultCard() {
  const searchParams = useSearch({ from: Route.fullPath });
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
    !currentAge ||
    !retirementAge ||
    !numYearsRequired ||
    !monthlyWithdrawal ||
    !interestRate ||
    !inflationRate ||
    !lumpsumRemaining
  ) {
    return null;
  }

  const yearsTillRetirement = retirementAge - currentAge;
  const annualWithdrawal = monthlyWithdrawal * 12;
  const realInterestRate = (interestRate - inflationRate) / 100;
  const presentValue =
    (annualWithdrawal * (1 - (1 + realInterestRate) ** -numYearsRequired)) /
      realInterestRate +
    lumpsumRemaining / (1 + realInterestRate) ** yearsTillRetirement;
  const futureValue =
    presentValue * (1 + inflationRate / 100) ** yearsTillRetirement;

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
        <Link to={GoalsRoute.to}>
          <Button className="cursor-pointer">
            <Target className="w-4 h-4" />
            Add to your Goals
          </Button>
        </Link>
      </CardFooter>
    </>
  );
}
