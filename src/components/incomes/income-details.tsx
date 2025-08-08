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

const incomeSchema = z.object({
    name: z.string(),
    description: z.string(),
    value: z.coerce.number(),
    startYear: z.coerce.number(),
    endYear: z.coerce.number(),
    annualGrowthRate: z.coerce.number(),
});

interface IncomeDetailsProps {
    incomeId: string;
    onClose?: () => void;
}

export function IncomeDetails({ incomeId, onClose }: IncomeDetailsProps) {
    const incomes = useStore((state) => state.incomes);
    const income = incomes.find((i) => i.id === incomeId);

    const form = useForm<z.infer<typeof incomeSchema>>({
        resolver: zodResolver(incomeSchema),
        defaultValues: {
            name: "",
            description: "",
            value: 0,
            startYear: new Date().getFullYear(),
            endYear: new Date().getFullYear() + 10,
            annualGrowthRate: 0,
        },
    });

    // Update form values when income changes
    useEffect(() => {
        if (income) {
            form.reset({
                name: income.name,
                description: income.description,
                value: income.value,
                startYear: income.startYear,
                endYear: income.endYear,
                annualGrowthRate: income.annualGrowthRate,
            });
        }
    }, [income, form]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Income Details</DialogTitle>
                <DialogDescription>View your income information</DialogDescription>
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
                                        placeholder="e.g. Salary"
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
                                        placeholder="e.g. Monthly salary from primary employment"
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
                                <FormLabel>Annual Value (in today's money)</FormLabel>
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
                                <FormLabel>Annual Growth Rate (%)</FormLabel>
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
