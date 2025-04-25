import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info, Target } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
const retirementCalculatorSchema = z.object({
  currentAge: z.coerce.number(),
  retirementAge: z.coerce.number(),
  numYearsRequired: z.coerce.number(),
  monthlyWithdrawal: z.coerce.number(),
  interestRate: z.coerce.number(),
  inflationRate: z.coerce.number(),
  lumpsumRemaining: z.coerce.number(),
});
export function RetirementCalculator() {
  const [presentValue, setPresentValue] = useState<number | null>(null);
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const form = useForm<z.infer<typeof retirementCalculatorSchema>>({
    resolver: zodResolver(retirementCalculatorSchema),
    defaultValues: {
      currentAge: 50,
      retirementAge: 65,
      numYearsRequired: 20,
      monthlyWithdrawal: 10000,
      interestRate: 7,
      inflationRate: 5,
      lumpsumRemaining: 60000,
    },
  });
  function onSubmit(data: z.infer<typeof retirementCalculatorSchema>) {
    const {
      currentAge,
      retirementAge,
      numYearsRequired,
      monthlyWithdrawal,
      interestRate,
      inflationRate,
      lumpsumRemaining,
    } = data;
    const yearsTillRetirement = retirementAge - currentAge;
    const annualWithdrawal = monthlyWithdrawal * 12;
    const realInterestRate = (interestRate - inflationRate) / 100;
    const presentValue =
      (annualWithdrawal * (1 - (1 + realInterestRate) ** -numYearsRequired)) /
        realInterestRate +
      lumpsumRemaining / (1 + realInterestRate) ** yearsTillRetirement;
    setPresentValue(presentValue);
    const futureValue =
      presentValue * (1 + inflationRate / 100) ** yearsTillRetirement;
    setFutureValue(futureValue);
  }
  function onReset() {
    form.reset();
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Retirement Calculator</CardTitle>
        <CardDescription>
          Calculate how much money you need to save for retirement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-4"
          >
            <FormField
              control={form.control}
              name="currentAge"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                    <FormLabel className="w-1/3">
                      Current Age{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>Your age now</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="text-right" />
                    </FormControl>
                    <Label className="w-12"></Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retirementAge"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                    <FormLabel className="w-1/3">
                      Retirement Age{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>The age you plan on retiring</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="text-right" />
                    </FormControl>
                    <Label className="w-12"></Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numYearsRequired"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                    <FormLabel className="w-1/3">
                      Number of Years Required{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          How long you plan to live in retirement, drawing
                          income from your annuity
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="text-right" />
                    </FormControl>
                    <Label className="w-12"></Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyWithdrawal"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                    <FormLabel className="w-1/3">
                      Monthly Withdrawal{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>
                            The amount you plan to withdraw each month from your
                            annuity before tax in today's money i.e. if you were
                            to retire today, how much money would you need each
                            month to get by and do all the things you want to do
                            in retirement
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step={1000}
                        className="text-right"
                      />
                    </FormControl>
                    <Label className="w-12">ZAR</Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                    <FormLabel className="w-1/3">
                      Interest Rate{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>The expected rate of return on your annuity</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step={0.5}
                        className="text-right"
                      />
                    </FormControl>
                    <Label className="w-12">%</Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inflationRate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                    <FormLabel className="w-1/3">
                      Inflation Rate{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>The expected rate of inflation</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step={0.5}
                        className="text-right"
                      />
                    </FormControl>
                    <Label className="w-12">%</Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lumpsumRemaining"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                    <FormLabel className="w-1/3">
                      Lumpsum Remaining{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>
                            The amount of money left in your annuity after the
                            number of years required. To make sure you don't hit
                            the 17.5% limit, set this to ~6x your monthly
                            withdrawal.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step={1000}
                        className="text-right"
                      />
                    </FormControl>
                    <Label className="w-12">ZAR</Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-4 items-center justify-end">
              <Button type="button" variant="outline" onClick={onReset}>
                Reset
              </Button>
              <Button type="submit">Calculate</Button>
            </div>
          </form>
        </Form>
        {presentValue && futureValue && (
          <Card>
            <CardHeader className="-mb-4">
              <CardTitle className="text-center">
                At retirement you will need{" "}
                <span className="text-xl font-bold">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    maximumFractionDigits: 0,
                  }).format(futureValue)}{" "}
                </span>
                to purchase a living annuity to meet your requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm">
              <ul>
                <li>
                  This is the equivalent of{" "}
                  <span className="text-lg">
                    {new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                      maximumFractionDigits: 0,
                    }).format(presentValue)}
                  </span>{" "}
                  in today's money
                </li>
                <li>
                  The real return of your investments after inflation is{" "}
                  <span className="text-lg">
                    {form.getValues("interestRate") -
                      form.getValues("inflationRate")}
                    %
                  </span>
                </li>
                <li>
                  Your annual drawdown must be between{" "}
                  <span className="text-lg">2.5%</span> and{" "}
                  <span className="text-lg">17.5%</span> each year. After you
                  hit this upper limit and the amount you're able to withdraw
                  will start to decrease
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-row gap-4 items-center justify-center">
              <Button>
                <Target className="w-4 h-4" />
                Add to your Goals
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
