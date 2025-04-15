import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CirclePlus } from "lucide-react";
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Id } from "@/../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Label } from "@/components/ui/label";

const assetSchema = z.object({
  name: z.string(),
  type: z.string(),
  startYear: z.coerce.number(),
  endYear: z.coerce.number().optional(),
  principalAmount: z.coerce.number(),
  interestRate: z.coerce.number(),
  annualContribution: z.coerce.number().optional(),
  fromAccount: z.optional(z.string()),
});

export function NewAssetDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const assets = useQuery(api.assets.getAssets);
  const newAssetForm = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      type: "current",
      startYear: new Date().getFullYear(),
      endYear: undefined,
      principalAmount: 0,
      interestRate: 0,
      annualContribution: 0,
      fromAccount: undefined,
    },
  });

  const addAsset = useMutation(api.assets.addAsset);

  function onSubmitAsset(data: z.infer<typeof assetSchema>) {
    addAsset({
      name: data.name,
      type: data.type,
      startYear: data.startYear,
      endYear: data.endYear,
      principalAmount: data.principalAmount,
      interestRate: data.interestRate,
      annualContribution: data.annualContribution,
      fromAccount: data.fromAccount as Id<"asset"> | undefined,
    });
    setIsOpen(false);
    newAssetForm.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...newAssetForm}>
          <form
            onSubmit={newAssetForm.handleSubmit(onSubmitAsset)}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Add Asset</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Add a new asset to your balance sheet.
            </DialogDescription>

            <FormField
              control={newAssetForm.control}
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
              control={newAssetForm.control}
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
              control={newAssetForm.control}
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
              control={newAssetForm.control}
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
            <div className="flex flex-row gap-2 justify-between">
              <FormField
                control={newAssetForm.control}
                name="annualContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Contribution</FormLabel>
                    <div className="flex flex-row gap-2 items-center">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="10000"
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
                control={newAssetForm.control}
                name="fromAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Account</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "reset" ? "" : value)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="reset">None</SelectItem>
                        <SelectSeparator />
                        {assets?.map((asset) => (
                          <SelectItem key={asset._id} value={asset._id}>
                            {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <FormField
                control={newAssetForm.control}
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
                control={newAssetForm.control}
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
              <Button type="submit">Add Asset</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
