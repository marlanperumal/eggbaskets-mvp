import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableHead, TableHeader, TableRow } from "../ui/table"

export function AssetsTable() {
  return (
    <Card className="gap-0 flex-1 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center justify-between">
            Assets
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </CardContent>
    </Card>
  )
}