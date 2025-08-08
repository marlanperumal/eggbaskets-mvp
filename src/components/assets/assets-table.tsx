import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NewAsset } from "./new-asset";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

function AssetOptions({ assetId }: { assetId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const deleteAsset = useStore((state) => state.deleteAsset);

  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem onClick={() => deleteAsset(assetId)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* TODO: Add EditAsset component */}
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {/* TODO: Add AssetDetails component */}
      </Dialog>
    </>
  );
}

export function AssetsTable() {
  const assets = useStore((state) => state.assets);

  return (
    <Card className="gap-0 flex-1 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center justify-between">
            Assets
            <NewAsset />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="hidden lg:table-cell">Start Year</TableHead>
              <TableHead className="hidden lg:table-cell">Growth Rate</TableHead>
              <TableHead className="text-center w-0">
                <div className="flex justify-center">
                  <Settings className="w-4 h-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{asset.type}</TableCell>
                <TableCell className="hidden md:table-cell">{asset.description}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    maximumFractionDigits: 0,
                  }).format(asset.value)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{asset.startYear}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {asset.annualGrowthRate}%
                </TableCell>
                <TableCell className="flex justify-center">
                  <AssetOptions assetId={asset.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}