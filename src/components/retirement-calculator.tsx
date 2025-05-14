import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { RetirementResultCard } from "@/components/retirement-result-card";
import { RetirementCalculatorForm } from "@/components/retirement-calculator-form";
import { RetirementResultChart } from "@/components/retirement-result-chart";
export function RetirementCalculator() {
  return (
    <div className="flex flex-row gap-2">
      <Card>
        <CardHeader className="-mb-2">
          <CardTitle>Retirement Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="la-principle-required">
            <TabsList className="flex flex-row gap-2 w-full">
              <TabsTrigger value="la-principle-required">
                How much do I need?
              </TabsTrigger>
              <TabsTrigger value="la-withdrawal-available">
                How much can I get?
              </TabsTrigger>
            </TabsList>
            <TabsContent value="la-principle-required">
              <RetirementCalculatorForm />
            </TabsContent>
            <TabsContent value="assumptions">
              <p>Assumptions</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card className="justify-center">
        <RetirementResultCard />
      </Card>
      <Card className="min-w-1/3">
        <CardHeader>
          <CardTitle>Retirement Result Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <RetirementResultChart />
        </CardContent>
      </Card>
    </div>
  );
}
