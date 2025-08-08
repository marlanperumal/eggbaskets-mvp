import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { NewGoal } from "./new-goal";
import { EditGoal } from "./edit-goal";
import { GoalDetails } from "./goal-details";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { useStore } from "@/store";
import { Button } from "../ui/button";
import { EllipsisVertical, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Dialog, DialogTrigger } from "../ui/dialog";

function GoalOptions({ goalId }: { goalId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const deleteGoal = useStore((state) => state.deleteGoal);

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
            <DropdownMenuItem onClick={() => deleteGoal(goalId)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditGoal goalId={goalId} onClose={() => setIsEditOpen(false)} />
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <GoalDetails goalId={goalId} onClose={() => setIsDetailsOpen(false)} />
      </Dialog>
    </>
  );
}

export function GoalsTable() {
  const goals = useStore((state) => state.goals);

  return (
    <Card className="gap-0 flex-1 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center justify-between">
            Goals
            <NewGoal />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="hidden md:table-cell">Start Year</TableHead>
              <TableHead className="hidden md:table-cell">Funded</TableHead>
              <TableHead className="text-center w-0">
                <div className="flex justify-center">
                  <Settings className="w-4 h-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.id}>
                <TableCell>{goal.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{goal.type}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    maximumFractionDigits: 0,
                  }).format(goal.value)}
                </TableCell>
                <TableCell className="hidden md:table-cell">{goal.startYear}</TableCell>
                <TableCell className="hidden md:table-cell">{goal.funded ? "Yes" : "No"}</TableCell>
                <TableCell className="flex justify-center">
                  <GoalOptions goalId={goal.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
