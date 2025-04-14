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
import { SquarePlus } from "lucide-react";

export function BalanceSheet() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 flex-row gap-2 items-stretch">
        <Card className="gap-0 flex-1">
          <CardHeader>
            <CardTitle>
              <div className="flex flex-row gap-2 items-center justify-between">
                Assets
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
                  <TableCell>Transaction Account</TableCell>
                  <TableCell>R0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Investment</TableCell>
                  <TableCell>Fixed Deposit</TableCell>
                  <TableCell>R1,000,000</TableCell>
                </TableRow>
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
