import { EllipsisVertical, Settings, SquarePlus } from "lucide-react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

import { NewAssetDialog } from "./new-asset-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BalanceSheet() {
  const assets = useQuery(api.assets.getAssets);
  const deleteAsset = useMutation(api.assets.deleteAsset);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 flex-row gap-2 items-stretch">
        <Card className="gap-0 flex-1">
          <CardHeader>
            <CardTitle>
              <div className="flex flex-row gap-2 items-center justify-between">
                Assets
                <NewAssetDialog />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
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
          </CardContent>
        </Card>
        <Card className="gap-0 flex-1">
          <CardHeader>
            <CardTitle>
              <div className="flex flex-row gap-2 items-center justify-between">
                Liabilities
                <Button variant="ghost" size="icon">
                  <SquarePlus />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Current</TableCell>
                  <TableCell>Overdraft</TableCell>
                  <TableCell>R0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Current</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell>R0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Loan</TableCell>
                  <TableCell>Home Loan</TableCell>
                  <TableCell>R1,000,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Net Worth: R1,000,000</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
