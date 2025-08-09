import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
} from "@/components/ui/form";
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

const assetSchema = z.object({
  name: z.string(),
  type: z.enum([
    "Cash",
    "Fixed Appreciating",
    "Fixed Depreciating",
    "Investment",
    "Retirement Savings",
    "Other",
  ]),
  description: z.string(),
  value: z.coerce.number(),
  startYear: z.coerce.number(),
  endYear: z.coerce.number(),
  monthlyContribution: z.coerce.number(),
  annualGrowthRate: z.coerce.number(),
});

interface EditAssetProps {
  assetId: string;
  onClose?: () => void;
}

export function EditAsset({ assetId, onClose }: EditAssetProps) {
  const assets = useStore((state) => state.assets);
  const updateAsset = useStore((state) => state.updateAsset);
  const asset = assets.find((a) => a.id === assetId);

  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      type: "Investment",
      description: "",
      value: 0,
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 10,
      monthlyContribution: 0,
      annualGrowthRate: 0,
    },
  });

  // Update form values when asset changes
  useEffect(() => {
    if (asset) {
      form.reset({
        name: asset.name,
        type: asset.type,
        description: asset.description,
        value: asset.value,
        startYear: asset.startYear,
        endYear: asset.endYear,
        monthlyContribution: asset.monthlyContribution,
        annualGrowthRate: asset.annualGrowthRate,
      });
    }
  }, [asset, form]);

  function onSubmit(data: z.infer<typeof assetSchema>) {
    console.log("Form submitted");
    updateAsset({ ...data, id: assetId });
    onClose?.();
  }

  function handleSubmit(e: React.FormEvent) {
    console.log("Form submitting");
    console.log("Form errors:", form.formState.errors);
    console.log("Form values:", form.getValues());
    form.handleSubmit(onSubmit)(e);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Asset</DialogTitle>
        <DialogDescription>Update your asset details</DialogDescription>
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
                    placeholder="e.g. Investment Portfolio"
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
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Fixed Appreciating">
                        Fixed Appreciating
                      </SelectItem>
                      <SelectItem value="Fixed Depreciating">
                        Fixed Depreciating
                      </SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Retirement Savings">
                        Retirement Savings
                      </SelectItem>
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
                    placeholder="e.g. Diversified investment portfolio"
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
                <FormLabel>Current Value (in today's money)</FormLabel>
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
            name="monthlyContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Contribution</FormLabel>
                <div className="flex flex-row gap-2 items-center">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1000"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose?.()}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update Asset"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
