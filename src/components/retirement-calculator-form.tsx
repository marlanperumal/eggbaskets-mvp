import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useRef } from "react";
import { Info } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/retirement";

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
  lumpsumRemaining: 700000,
};

export function RetirementCalculatorForm() {
  const searchParams = useSearch({ from: Route.fullPath });
  const npv = searchParams.npv;
  const navigate = useNavigate({ from: Route.fullPath });
  const onValuesChange = useCallback(
    (values: z.infer<typeof retirementCalculatorSchema>) => {
      navigate({
        search: (search) => ({
          ...search,
          ...values,
          npv,
        }),
        replace: true,
      });
    },
    [navigate, npv]
  );
  const form = useForm<z.infer<typeof retirementCalculatorSchema>>({
    resolver: zodResolver(retirementCalculatorSchema),
    defaultValues: {
      ...defaultFormValues,
      ...searchParams,
    },
  });

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
    <Form {...form}>
      <form className="space-y-4 mb-4 px-2">
        <FormField
          control={form.control}
          name="currentAge"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                      <Input {...field} type="number" className="text-right" />
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                      <Input {...field} type="number" className="text-right" />
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <FormLabel>
                  Number of Years Required{" "}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      How long you plan to live in retirement, drawing income
                      from your annuity
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2 items-stretch">
                    <div className="flex flex-row gap-2 items-center">
                      <Input {...field} type="number" className="text-right" />
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <FormLabel>
                  Monthly Withdrawal{" "}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        The amount you plan to withdraw each month from your
                        annuity before tax in today's money i.e. if you were to
                        retire today, how much money would you need each month
                        to get by and do all the things you want to do in
                        retirement
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <FormLabel>
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
                        max={30}
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                        max={30}
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <FormLabel>
                  Lumpsum Remaining{" "}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        The amount of money left in your annuity after the
                        number of years required. To make sure you don't hit the
                        17.5% limit, set this to ~70x your monthly withdrawal.
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
                        step={10000}
                        className="text-right"
                      />
                      <Label className="w-12">ZAR</Label>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Slider
                        min={0}
                        max={10000000}
                        step={100000}
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
  );
}
