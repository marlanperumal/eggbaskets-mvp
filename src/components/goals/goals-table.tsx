import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { NewGoal } from "./new-goal";
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

function GoalOptions({ goalId }: { goalId: string }) {
  const deleteGoal = useStore((state) => state.deleteGoal);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => deleteGoal(goalId)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function GoalsTable() {
  const goals = useStore((state) => state.goals);

  return (
    <Card className="gap-0 flex-1">
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
              <TableHead>Value</TableHead>
              <TableHead>Start Year</TableHead>
              <TableHead>Funded</TableHead>
              <TableHead className="text-center">
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
                <TableCell>{goal.value}</TableCell>
                <TableCell>{goal.startYear}</TableCell>
                <TableCell>{goal.funded ? "Yes" : "No"}</TableCell>
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
