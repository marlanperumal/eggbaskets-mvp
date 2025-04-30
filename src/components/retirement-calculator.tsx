import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { RetirementResultCard } from "@/components/retirement-result-card";
import { RetirementCalculatorForm } from "@/components/retirement-calculator-form";

export function RetirementCalculator() {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
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
      <RetirementResultCard />
    </div>
  );
}
