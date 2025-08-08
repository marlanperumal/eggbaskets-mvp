import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { RetirementResultCard } from "@/components/retirement-result-card";
import { RetirementCalculatorForm } from "@/components/retirement-calculator-form";
import { RetirementResultChart } from "@/components/retirement-result-chart";
export function RetirementCalculator() {
  return (
    <div className="flex flex-col gap-2 w-full lg:flex-row">
      <Card className="lg:flex-shrink-0">
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
      <Card className="justify-center lg:flex-shrink-0 min-w-0 lg:basis-80 xl:basis-1/4">
        <RetirementResultCard />
      </Card>
      <Card className="lg:min-w-1/3 flex-1 flex flex-col">
        <CardContent className="flex-1">
          <RetirementResultChart />
        </CardContent>
      </Card>
    </div>
  );
}
