import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormLabel, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const expenseSchema = z.object({
    name: z.string(),
    description: z.string(),
    value: z.coerce.number(),
    startYear: z.coerce.number(),
    endYear: z.coerce.number(),
    annualGrowthRate: z.coerce.number(),
});

interface ExpenseDetailsProps {
    expenseId: string;
    onClose?: () => void;
}

export function ExpenseDetails({ expenseId, onClose }: ExpenseDetailsProps) {
    const expenses = useStore((state) => state.expenses);
    const expense = expenses.find((e) => e.id === expenseId);

    const form = useForm<z.infer<typeof expenseSchema>>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            name: "",
            description: "",
            value: 0,
            startYear: new Date().getFullYear(),
            endYear: new Date().getFullYear() + 10,
            annualGrowthRate: 0,
        },
    });

    // Update form values when expense changes
    useEffect(() => {
        if (expense) {
            form.reset({
                name: expense.name,
                description: expense.description,
                value: expense.value,
                startYear: expense.startYear,
                endYear: expense.endYear,
                annualGrowthRate: expense.annualGrowthRate,
            });
        }
    }, [expense, form]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Expense Details</DialogTitle>
                <DialogDescription>View your expense information</DialogDescription>
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
                                        placeholder="e.g. Groceries"
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
                                        placeholder="e.g. Monthly grocery shopping expenses"
                                        className="w-72"
                                        disabled
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Value (in today's money)</FormLabel>
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
                        name="endYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Year</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" className="w-72" disabled />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="annualGrowthRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Annual Growth Rate (%) above inflation</FormLabel>
                                <div className="flex flex-row gap-2 items-center">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.1"
                                            className="text-right w-72"
                                            disabled
                                        />
                                    </FormControl>
                                    <Label>%</Label>
                                </div>
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
