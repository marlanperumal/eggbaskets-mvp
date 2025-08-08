import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormLabel, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStore } from "@/store";

const goalSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["Retirement", "Asset", "Expense"]),
  value: z.coerce.number(),
  startYear: z.coerce.number(),
  recurrence: z.coerce.number(),
  numOccurrences: z.coerce.number(),
  funded: z.boolean(),
});

interface GoalDetailsProps {
  goalId: string;
  onClose?: () => void;
}

export function GoalDetails({ goalId, onClose }: GoalDetailsProps) {
  const goals = useStore((state) => state.goals);
  const goal = goals.find((g) => g.id === goalId);

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "Retirement",
      value: 0,
      startYear: new Date().getFullYear(),
      recurrence: 1,
      numOccurrences: 1,
      funded: false,
    },
  });

  // Update form values when goal changes
  useEffect(() => {
    if (goal) {
      form.reset({
        name: goal.name,
        description: goal.description,
        type: goal.type,
        value: goal.value,
        startYear: goal.startYear,
        recurrence: goal.recurrence,
        numOccurrences: goal.numOccurrences,
        funded: goal.funded,
      });
    }
  }, [goal, form]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Goal Details</DialogTitle>
        <DialogDescription>View your goal information</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Buy a house"
                    className="w-72"
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g. Save enough for a 10% deposit on a house"
                    className="w-72"
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retirement">Retirement</SelectItem>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value (in today's money)</FormLabel>
                <div className="flex flex-row gap-2 items-center">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="10000"
                      className="text-right w-72"
                      disabled
                    />
                  </FormControl>
                  <Label>ZAR</Label>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Year</FormLabel>
                <FormControl>
                  <Input {...field} type="number" className="w-72" disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence (every N years)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    className="w-72"
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numOccurrences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Occurrences</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    className="w-72"
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="funded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormLabel>Funded</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose?.()}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
