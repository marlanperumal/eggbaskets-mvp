import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormLabel, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useStore } from "@/store";

const incomeSchema = z.object({
    name: z.string(),
    description: z.string(),
    value: z.coerce.number(),
    startYear: z.coerce.number(),
    endYear: z.coerce.number(),
    annualGrowthRate: z.coerce.number(),
});

export function NewIncome() {
    const [isOpen, setIsOpen] = useState(false);
    const addIncome = useStore((state) => state.addIncome);
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

    function onSubmit(data: z.infer<typeof incomeSchema>) {
        console.log("Form submitted");
        addIncome({ ...data, id: crypto.randomUUID() as string });
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
                    <DialogTitle>New Income</DialogTitle>
                    <DialogDescription>
                        Add a new income source to your financial plan
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
                                            placeholder="e.g. Salary"
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
                                            placeholder="e.g. Monthly salary from primary employment"
                                            className="w-72"
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
                            name="endYear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Year</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" className="w-72" />
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
                                            />
                                        </FormControl>
                                        <Label>%</Label>
                                    </div>
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
                                {form.formState.isSubmitting ? "Creating..." : "Create Income"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
