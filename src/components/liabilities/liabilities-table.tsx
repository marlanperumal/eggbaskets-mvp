import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

function LiabilityOptions({ liabilityId }: { liabilityId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const deleteLiability = useStore((state) => state.deleteLiability);

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
            <DropdownMenuItem onClick={() => deleteLiability(liabilityId)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* TODO: Add EditLiability component */}
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {/* TODO: Add LiabilityDetails component */}
      </Dialog>
    </>
  );
}

export function LiabilitiesTable() {
  const liabilities = useStore((state) => state.liabilities);

  return (
    <Card className="gap-0 flex-1 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center justify-between">
            Liabilities
            {/* TODO: Add NewLiability component */}
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
              <TableHead className="hidden lg:table-cell">Interest Rate</TableHead>
              <TableHead className="text-center w-0">
                <div className="flex justify-center">
                  <Settings className="w-4 h-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liabilities.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell>{liability.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{liability.type}</TableCell>
                <TableCell className="hidden md:table-cell">{liability.description}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    maximumFractionDigits: 0,
                  }).format(liability.value)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{liability.startYear}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {liability.interestRate}%
                </TableCell>
                <TableCell className="flex justify-center">
                  <LiabilityOptions liabilityId={liability.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}