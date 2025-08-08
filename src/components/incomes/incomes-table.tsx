import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NewIncome } from "./new-income";
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

function IncomeOptions({ incomeId }: { incomeId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const deleteIncome = useStore((state) => state.deleteIncome);

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
            <DropdownMenuItem onClick={() => deleteIncome(incomeId)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* TODO: Add EditIncome component */}
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {/* TODO: Add IncomeDetails component */}
      </Dialog>
    </>
  );
}

export function IncomesTable() {
  const incomes = useStore((state) => state.incomes);

  return (
    <Card className="gap-0 flex-1 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center justify-between">
            Incomes
            <NewIncome />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Description</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="hidden md:table-cell">Start Year</TableHead>
              <TableHead className="hidden md:table-cell">End Year</TableHead>
              <TableHead className="hidden lg:table-cell">Growth Rate</TableHead>
              <TableHead className="text-center w-0">
                <div className="flex justify-center">
                  <Settings className="w-4 h-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell>{income.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{income.description}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    maximumFractionDigits: 0,
                  }).format(income.value)}
                </TableCell>
                <TableCell className="hidden md:table-cell">{income.startYear}</TableCell>
                <TableCell className="hidden md:table-cell">{income.endYear}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {income.annualGrowthRate}%
                </TableCell>
                <TableCell className="flex justify-center">
                  <IncomeOptions incomeId={income.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}