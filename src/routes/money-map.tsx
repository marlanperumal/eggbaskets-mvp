import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { IncomesTable } from '@/components/incomes/incomes-table'
import { ExpensesTable } from '@/components/expenses/expenses-table'
import { AssetsTable } from '@/components/assets/assets-table'
import { LiabilitiesTable } from '@/components/liabilities/liabilities-table'
import { MoneyMap } from '@/components/money-map'

export const Route = createFileRoute('/money-map')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex flex-col gap-2 p-2">
    <Card>
      <CardContent>
        <p className="text-sm text-center">
          The money map is a more than just a budget of incomes and expenses.
          <br />
          It's also where you'll see how you fund your investments and goals and pay off your debts.
          <br />
          And specifically, it will show how this changes over time.
        </p>
      </CardContent>
    </Card>
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
      <div className="lg:basis-1/2 min-w-0 flex flex-col gap-2">
        <IncomesTable />
        <ExpensesTable />
        <AssetsTable />
        <LiabilitiesTable />
      </div>
      <div className="md:basis-1/2 min-w-0 flex">
        <MoneyMap />
      </div>
    </div>
  </div>
}
