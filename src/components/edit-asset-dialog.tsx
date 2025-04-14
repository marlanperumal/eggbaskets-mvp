import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Label } from "@/components/ui/label";
import type { Id } from "@/../convex/_generated/dataModel";
import { useEffect } from "react";

const assetSchema = z.object({
  name: z.string(),
  type: z.string(),
  startYear: z.coerce.number(),
  endYear: z.coerce.number().optional(),
  principalAmount: z.coerce.number(),
  interestRate: z.coerce.number(),
  annualContribution: z.coerce.number().optional(),
});

export function EditAssetDialog({
  assetId,
  onComplete,
}: {
  assetId: Id<"asset"> | null;
  onComplete: () => void;
}) {
  if (!assetId) {
    return null;
  }
  const asset = useQuery(api.assets.getAsset, { id: assetId });

  const editAssetForm = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
  });

  // Reset form with asset data when it becomes available
  useEffect(() => {
    if (asset) {
      editAssetForm.reset({
        name: asset.name,
        type: asset.type,
        startYear: asset.startYear,
        endYear: asset.endYear,
        principalAmount: asset.principalAmount,
        interestRate: asset.interestRate,
        annualContribution: asset.annualContribution,
      });
    }
  }, [asset, editAssetForm]);

  const updateAsset = useMutation(api.assets.updateAsset);

  function onSubmitAsset(data: z.infer<typeof assetSchema>) {
    updateAsset({
      id: assetId!,
      name: data.name,
      type: data.type,
      startYear: data.startYear,
      endYear: data.endYear,
      principalAmount: data.principalAmount,
      interestRate: data.interestRate,
      annualContribution: data.annualContribution,
    });
    onComplete();
  }

  if (!asset) {
    return null; // Or show a loading state
  }

  return (
    <DialogContent>
      <Form {...editAssetForm}>
        <form
          onSubmit={editAssetForm.handleSubmit(onSubmitAsset)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <DialogDescription>Edit the details of the asset.</DialogDescription>

          <FormField
            control={editAssetForm.control}
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
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editAssetForm.control}
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
            control={editAssetForm.control}
            name="principalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principal Amount</FormLabel>
                <div className="flex flex-row gap-2 items-center">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="10000"
                      placeholder="Initial value in ZAR"
                      className="text-right w-36"
                    />
                  </FormControl>
                  <Label className="w-12">ZAR</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editAssetForm.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate</FormLabel>
                <div className="flex flex-row gap-2 items-center">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      className="text-right w-36"
                    />
                  </FormControl>
                  <Label className="w-12">%</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editAssetForm.control}
            name="annualContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Contribution</FormLabel>
                <div className="flex flex-row gap-2 items-center">
                  <FormControl>
                    <Input
                      type="number"
                      step="10000"
                      className="text-right w-36"
                      {...field}
                    />
                  </FormControl>
                  <Label className="w-12">ZAR</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2 justify-between">
            <FormField
              control={editAssetForm.control}
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
              control={editAssetForm.control}
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
            <Button type="submit">Update Asset</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
