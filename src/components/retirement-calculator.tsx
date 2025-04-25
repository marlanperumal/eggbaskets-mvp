import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info, Target } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
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
import { Slider } from "@/components/ui/slider";
const retirementCalculatorSchema = z.object({
  currentAge: z.coerce.number(),
  retirementAge: z.coerce.number(),
  numYearsRequired: z.coerce.number(),
  monthlyWithdrawal: z.coerce.number(),
  interestRate: z.coerce.number(),
  inflationRate: z.coerce.number(),
  lumpsumRemaining: z.coerce.number(),
});

const defaultFormValues = {
  currentAge: 50,
  retirementAge: 65,
  numYearsRequired: 20,
  monthlyWithdrawal: 10000,
  interestRate: 7,
  inflationRate: 5,
  lumpsumRemaining: 60000,
};

type RetirementCalculatorProps = {
  defaultValues?: Partial<z.infer<typeof retirementCalculatorSchema>>;
  onValuesChange?: (values: z.infer<typeof retirementCalculatorSchema>) => void;
};

export function RetirementCalculator({
  defaultValues,
  onValuesChange,
}: RetirementCalculatorProps) {
  const form = useForm<z.infer<typeof retirementCalculatorSchema>>({
    resolver: zodResolver(retirementCalculatorSchema),
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  const [
    currentAge,
    retirementAge,
    numYearsRequired,
    monthlyWithdrawal,
    interestRate,
    inflationRate,
    lumpsumRemaining,
  ] = form.watch([
    "currentAge",
    "retirementAge",
    "numYearsRequired",
    "monthlyWithdrawal",
    "interestRate",
    "inflationRate",
    "lumpsumRemaining",
  ]);
  const yearsTillRetirement = retirementAge - currentAge;
  const annualWithdrawal = monthlyWithdrawal * 12;
  const realInterestRate = (interestRate - inflationRate) / 100;
  const presentValue =
    (annualWithdrawal * (1 - (1 + realInterestRate) ** -numYearsRequired)) /
      realInterestRate +
    lumpsumRemaining / (1 + realInterestRate) ** yearsTillRetirement;
  const futureValue =
    presentValue * (1 + inflationRate / 100) ** yearsTillRetirement;

  // Use a ref to track the timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Debounced callback for URL updates
  const debouncedOnChange = useCallback(
    (values: z.infer<typeof retirementCalculatorSchema>) => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        onValuesChange?.(values);
      }, 500);
    },
    [onValuesChange]
  );

  function onReset() {
    form.reset();
  }

  useEffect(() => {
    const subscription = form.watch((values, { type }) => {
      // Only update URL if form is valid and this is a user change
      if (form.formState.isValid && type === "change") {
        debouncedOnChange(values as z.infer<typeof retirementCalculatorSchema>);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [form, debouncedOnChange]);

  return (
    <div className="flex flex-row gap-2 flex-wrap">
      <Card>
        <CardHeader className="-mb-2">
          <CardTitle>Retirement Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="la-principle-required">
            <TabsList className="flex flex-row gap-2 w-full">
              <TabsTrigger value="la-principle-required">
                How much do I need?
              </TabsTrigger>
              <TabsTrigger value="la-withdrawal-available">
                How much can I get?
              </TabsTrigger>
            </TabsList>
            <TabsContent value="la-principle-required">
              <Form {...form}>
                <form className="space-y-4 mb-4 px-2">
                  <FormField
                    control={form.control}
                    name="currentAge"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <FormLabel>
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
                            <div className="flex flex-col gap-2 items-stretch">
                              <div className="flex flex-row gap-2 items-center">
                                <Input
                                  {...field}
                                  type="number"
                                  className="text-right"
                                />
                                <div className="w-12"></div>
                              </div>
                              <div className="flex flex-row gap-2 items-center">
                                <Slider
                                  min={0}
                                  max={100}
                                  value={[field.value]}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                  }}
                                />
                                <div className="w-12"></div>
                              </div>
                            </div>
                          </FormControl>
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
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <FormLabel>
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
                            <div className="flex flex-col gap-2 items-stretch">
                              <div className="flex flex-row gap-2 items-center">
                                <Input
                                  {...field}
                                  type="number"
                                  className="text-right"
                                />
                                <div className="w-12"></div>
                              </div>
                              <div className="flex flex-row gap-2 items-center">
                                <Slider
                                  min={0}
                                  max={100}
                                  value={[field.value]}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                  }}
                                />
                                <div className="w-12"></div>
                              </div>
                            </div>
                          </FormControl>
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
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <FormLabel>
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
                            <div className="flex flex-col gap-2 items-stretch">
                              <div className="flex flex-row gap-2 items-center">
                                <Input
                                  {...field}
                                  type="number"
                                  className="text-right"
                                />
                                <div className="w-12"></div>
                              </div>
                              <div className="flex flex-row gap-2 items-center">
                                <Slider
                                  min={0}
                                  max={100}
                                  value={[field.value]}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                  }}
                                />
                                <div className="w-12"></div>
                              </div>
                            </div>
                          </FormControl>
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
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <FormLabel>
                            Monthly Withdrawal{" "}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>
                                  The amount you plan to withdraw each month
                                  from your annuity before tax in today's money
                                  i.e. if you were to retire today, how much
                                  money would you need each month to get by and
                                  do all the things you want to do in retirement
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2 items-stretch">
                              <div className="flex flex-row gap-2 items-center">
                                <Input
                                  {...field}
                                  type="number"
                                  step={1000}
                                  className="text-right"
                                />
                                <Label className="w-12">ZAR</Label>
                              </div>
                              <div className="flex flex-row gap-2 items-center">
                                <Slider
                                  min={0}
                                  max={100000}
                                  step={1000}
                                  value={[field.value]}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                  }}
                                />
                                <div className="w-12"></div>
                              </div>
                            </div>
                          </FormControl>
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
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <FormLabel>
                            Interest Rate{" "}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>
                                  The expected rate of return on your annuity
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2 items-stretch">
                              <div className="flex flex-row gap-2 items-center">
                                <Input
                                  {...field}
                                  type="number"
                                  step={0.5}
                                  className="text-right"
                                />
                                <Label className="w-12">%</Label>
                              </div>
                              <div className="flex flex-row gap-2 items-center">
                                <Slider
                                  min={0}
                                  max={100}
                                  step={0.5}
                                  value={[field.value]}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                  }}
                                />
                                <div className="w-12"></div>
                              </div>
                            </div>
                          </FormControl>
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
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <FormLabel>
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
                            <div className="flex flex-col gap-2 items-stretch">
                              <div className="flex flex-row gap-2 items-center">
                                <Input
                                  {...field}
                                  type="number"
                                  step={0.5}
                                  className="text-right"
                                />
                                <Label className="w-12">%</Label>
                              </div>
                              <div className="flex flex-row gap-2 items-center">
                                <Slider
                                  min={0}
                                  max={100}
                                  step={0.5}
                                  value={[field.value]}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                  }}
                                />
                                <div className="w-12"></div>
                              </div>
                            </div>
                          </FormControl>
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
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <FormLabel>
                            Lumpsum Remaining{" "}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>
                                  The amount of money left in your annuity after
                                  the number of years required. To make sure you
                                  don't hit the 17.5% limit, set this to ~6x
                                  your monthly withdrawal.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2 items-stretch">
                              <div className="flex flex-row gap-2 items-center">
                                <Input
                                  {...field}
                                  type="number"
                                  step={1000}
                                  className="text-right"
                                />
                                <Label className="w-12">ZAR</Label>
                              </div>
                              <div className="flex flex-row gap-2 items-center">
                                <Slider
                                  min={0}
                                  max={1000000}
                                  step={1000}
                                  value={[field.value]}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                  }}
                                />
                                <div className="w-12"></div>
                              </div>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row gap-4 items-center justify-end">
                    <Button type="button" variant="outline" onClick={onReset}>
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="assumptions">
              <p>Assumptions</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {presentValue && futureValue && (
        <Card className="justify-center">
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
                The real return on your living annuity investments after
                inflation is{" "}
                <span className="text-md font-bold">
                  {form.getValues("interestRate") -
                    form.getValues("inflationRate")}
                  %
                </span>
              </li>
              <li>
                Your annual drawdown must be between{" "}
                <span className="text-md font-bold">2.5%</span> and{" "}
                <span className="text-md font-bold">17.5%</span> each year.
                After you hit this upper limit, the amount you're able to
                withdraw will start to decrease
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button>
              <Target className="w-4 h-4" />
              Add to your Goals
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
