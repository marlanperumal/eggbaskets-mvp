import { useState } from "react";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditLiabilityDialog } from "@/components/edit-liability-dialog";
import type { Id } from "@/../convex/_generated/dataModel";

function LiabilityOptions({ liabilityId }: { liabilityId: Id<"liability"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteLiability = useMutation(api.liabilities.deleteLiability);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onClick={() => deleteLiability({ id: liabilityId })}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditLiabilityDialog
        liabilityId={liabilityId}
        onComplete={() => setIsOpen(false)}
      />
    </Dialog>
  );
}

export function LiabilitiesTable() {
  const liabilities = useQuery(api.liabilities.getLiabilities);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Start Year</TableHead>
          <TableHead>End Year</TableHead>
          <TableHead className="text-right">Principal</TableHead>
          <TableHead className="text-center">
            <div className="flex justify-center">
              <Settings className="w-4 h-4" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {liabilities?.map((liability) => (
          <TableRow key={liability._id}>
            <TableCell>{liability.type}</TableCell>
            <TableCell>{liability.name}</TableCell>
            <TableCell>{liability.startYear}</TableCell>
            <TableCell>{liability.endYear}</TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
                maximumFractionDigits: 0,
              }).format(liability.principalAmount)}
            </TableCell>
            <TableCell className="flex justify-center">
              <LiabilityOptions liabilityId={liability._id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
