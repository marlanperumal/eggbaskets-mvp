import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormLabel, FormItem, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../ui/dialog";
import { CirclePlus } from "lucide-react";

const goalSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["Retirement", "Asset", "Expense"]),
  value: z.coerce.number(),
  startYear: z.coerce.number(),
  recurrence: z.coerce.number(),
  numOccurrences: z.coerce.number(),
  funded: z.boolean(),
});

export function NewGoal() {
  const [isOpen, setIsOpen] = useState(false);
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

  function onSubmit(data: z.infer<typeof goalSchema>) {
    console.log("Form submitted");
    console.log(data);
    setIsOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    console.log("Form submitting");
    console.log("Form errors:", form.formState.errors);
    console.log("Form values:", form.getValues());
    form.handleSubmit(onSubmit)(e);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Goal</DialogTitle>
          <DialogDescription>
            Add a new goal to your financial plan
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Input {...field} type="number" className="w-72" />
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
                    <Input {...field} type="number" min="1" className="w-72" />
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
                    <Input {...field} type="number" min="1" className="w-72" />
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
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
