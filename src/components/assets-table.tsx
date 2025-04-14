import { EllipsisVertical, Settings } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { TableBody } from "@/components/ui/table";
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AssetsTable() {
  const assets = useQuery(api.assets.getAssets);
  const deleteAsset = useMutation(api.assets.deleteAsset);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Start Year</TableHead>
          <TableHead>End Year</TableHead>
          <TableHead className="text-right">Principal</TableHead>
          <TableHead className="text-right">
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets?.map((asset) => (
          <TableRow key={asset._id}>
            <TableCell>{asset.type}</TableCell>
            <TableCell>{asset.name}</TableCell>
            <TableCell>{asset.startYear}</TableCell>
            <TableCell>{asset.endYear}</TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
                maximumFractionDigits: 0,
              }).format(asset.principalAmount)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteAsset({ id: asset._id })}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
