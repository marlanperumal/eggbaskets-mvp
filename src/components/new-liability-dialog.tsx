import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const liabilitySchema = z.object({
  name: z.string(),
  type: z.string(),
  startYear: z.coerce.number(),
  endYear: z.coerce.number().optional(),
  principalAmount: z.coerce.number(),
  interestRate: z.coerce.number(),
  annualRepayment: z.coerce.number().optional(),
});

export function NewLiabilityDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const newLiabilityForm = useForm<z.infer<typeof liabilitySchema>>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: {
      name: "",
      type: "current",
      startYear: new Date().getFullYear(),
      endYear: undefined,
      principalAmount: 0,
      interestRate: 0,
      annualRepayment: 0,
    },
  });

  const addLiability = useMutation(api.liabilities.addLiability);

  function onSubmitLiability(data: z.infer<typeof liabilitySchema>) {
    addLiability({
      name: data.name,
      type: data.type,
      startYear: data.startYear,
      endYear: data.endYear,
      principalAmount: data.principalAmount,
      interestRate: data.interestRate,
      annualRepayment: data.annualRepayment,
    });
    setIsOpen(false);
    newLiabilityForm.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SquarePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...newLiabilityForm}>
          <form
            onSubmit={newLiabilityForm.handleSubmit(onSubmitLiability)}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Add Liability</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Add a new liability to your balance sheet.
            </DialogDescription>

            <FormField
              control={newLiabilityForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newLiabilityForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newLiabilityForm.control}
              name="principalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="10000"
                      placeholder="Initial value in ZAR"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newLiabilityForm.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newLiabilityForm.control}
              name="annualRepayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Repayment</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="10000"
                      placeholder="Annual repayment in ZAR"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-2 justify-between">
              <FormField
                control={newLiabilityForm.control}
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={2025} max={2300} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newLiabilityForm.control}
                name="endYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Year</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={2025} max={2300} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add Liability</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
