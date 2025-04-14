import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingBasket, SquarePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const config = {
    assets: {
      label: "Assets",
      color: "hsl(217.2 91.2% 59.8%)",
    },
    liabilities: {
      label: "Liabilities",
      color: "hsl(0 84.2% 60.2%)",
    },
  } satisfies ChartConfig;
  const netWorthData = [
    {
      date: "2025",
      assets: 100000,
      liabilities: -50000,
    },
    {
      date: "2026",
      assets: 150000,
      liabilities: -30000,
    },
    {
      date: "2027",
      assets: 110000,
      liabilities: -48000,
    },
    {
      date: "2028",
      assets: 120000,
      liabilities: -52000,
    },
    {
      date: "2029",
      assets: 130000,
      liabilities: -56000,
    },
    {
      date: "2030",
      assets: 140000,
      liabilities: -60000,
    },
    {
      date: "2031",
      assets: 150000,
      liabilities: -64000,
    },
    {
      date: "2032",
      assets: 160000,
      liabilities: -68000,
    },
    {
      date: "2033",
      assets: 170000,
      liabilities: -72000,
    },
    {
      date: "2034",
      assets: 180000,
      liabilities: -76000,
    },
    {
      date: "2035",
      assets: 190000,
      liabilities: -80000,
    },
  ];
  return (
    <body className="flex flex-col h-screen w-screen">
      <header className="p-2 flex flex-row justify-between items-center bg-slate-300">
        <div className="flex flex-row gap-2 items-center">
          <ShoppingBasket className="w-8 h-8" />
          <h1 className="text-2xl font-bold">egg baskets</h1>
          <h2 className="text-md mt-2">financial planning</h2>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Label htmlFor="npv-switch">NPV</Label>
          <Switch id="npv-switch" checked={true} />
          <Avatar>
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 flex flex-row justify-between items-stretch">
        <div className="flex-1 p-2">
          <Tabs className="mb-2" defaultValue="assets-and-liabilities">
            <TabsList className="w-full">
              <TabsTrigger value="assets-and-liabilities">
                Assets & Liabilities
              </TabsTrigger>
              <TabsTrigger value="income-and-expenses">
                Income & Expenses
              </TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="assets-and-liabilities">
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
                    <CardTitle className="text-center">
                      Net Worth: R1,000,000
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="income-and-expenses">
              <div className="flex flex-row gap-2">
                <Card className="h-full">Income</Card>
                <Card className="h-full">Expenses</Card>
              </div>
            </TabsContent>
            <TabsContent value="goals">
              <div className="flex flex-row gap-2">
                <Card className="h-full">Goals</Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex-1 flex flex-col p-2 gap-1">
          <Card>
            <CardHeader>
              <CardTitle>Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={config} className="h-[150px] w-full">
                <AreaChart data={netWorthData}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Area
                    dataKey="assets"
                    fill="var(--color-assets)"
                    stroke="var(--color-assets)"
                  />
                  <Area
                    dataKey="liabilities"
                    fill="var(--color-liabilities)"
                    stroke="var(--color-liabilities)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={config} className="h-[150px] w-full">
                <LineChart data={netWorthData}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Line
                    dataKey="assets"
                    fill="var(--color-assets)"
                    stroke="var(--color-assets)"
                    dot={false}
                    type="natural"
                  />
                  <Line
                    dataKey="liabilities"
                    fill="var(--color-liabilities)"
                    stroke="var(--color-liabilities)"
                    dot={false}
                    type="natural"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Liquidity</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={config} className="h-[150px] w-full">
                <BarChart data={netWorthData} stackOffset="sign">
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Bar
                    dataKey="assets"
                    fill="var(--color-assets)"
                    stroke="var(--color-assets)"
                    stackId="a"
                  />
                  <Bar
                    dataKey="liabilities"
                    fill="var(--color-liabilities)"
                    stroke="var(--color-liabilities)"
                    stackId="a"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </body>
  );
}
