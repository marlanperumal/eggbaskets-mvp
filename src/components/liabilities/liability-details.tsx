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

const liabilitySchema = z.object({
    name: z.string(),
    type: z.enum(["Mortgage", "Loan", "Credit Card", "Other"]),
    description: z.string(),
    value: z.coerce.number(),
    startYear: z.coerce.number(),
    termInMonths: z.coerce.number(),
    interestRate: z.coerce.number(),
    monthlyPayment: z.coerce.number(),
});

interface LiabilityDetailsProps {
    liabilityId: string;
    onClose?: () => void;
}

export function LiabilityDetails({ liabilityId, onClose }: LiabilityDetailsProps) {
    const liabilities = useStore((state) => state.liabilities);
    const liability = liabilities.find((l) => l.id === liabilityId);

    const form = useForm<z.infer<typeof liabilitySchema>>({
        resolver: zodResolver(liabilitySchema),
        defaultValues: {
            name: "",
            type: "Loan",
            description: "",
            value: 0,
            startYear: new Date().getFullYear(),
            termInMonths: 240,
            interestRate: 0,
            monthlyPayment: 0,
        },
    });

    // Update form values when liability changes
    useEffect(() => {
        if (liability) {
            form.reset({
                name: liability.name,
                type: liability.type,
                description: liability.description,
                value: liability.value,
                startYear: liability.startYear,
                termInMonths: liability.termInMonths,
                interestRate: liability.interestRate,
                monthlyPayment: liability.monthlyPayment,
            });
        }
    }, [liability, form]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Liability Details</DialogTitle>
                <DialogDescription>View your liability information</DialogDescription>
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
                                        placeholder="e.g. Home Loan"
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
                                            <SelectItem value="Mortgage">Mortgage</SelectItem>
                                            <SelectItem value="Loan">Loan</SelectItem>
                                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        placeholder="e.g. Home loan for primary residence"
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
                                <FormLabel>Outstanding Balance</FormLabel>
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
                        name="termInMonths"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Term (in months)</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="1" className="w-72" disabled />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="interestRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interest Rate (%)</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="monthlyPayment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Payment</FormLabel>
                                <div className="flex flex-row gap-2 items-center">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="1000"
                                            className="text-right w-72"
                                            disabled
                                        />
                                    </FormControl>
                                    <Label>ZAR</Label>
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
