import { ResponsiveContainer } from "recharts";
import { Sankey } from "recharts";
import { Tooltip } from "recharts";
import { Card, CardContent } from "./ui/card";

export function MoneyMap() {
  return (
    <Card className="gap-0 flex-1 w-full">
      <CardContent>
        <ResponsiveContainer
          height={400}
          width="100%"
        >
          <Sankey
            data={{
              links: [
                {
                  source: 0,
                  target: 1,
                  value: 3728.3
                },
                {
                  source: 0,
                  target: 2,
                  value: 354170
                },
                {
                  source: 2,
                  target: 3,
                  value: 291741
                },
                {
                  source: 2,
                  target: 4,
                  value: 62429
                }
              ],
              nodes: [
                {
                  name: 'Visit'
                },
                {
                  name: 'Direct-Favourite'
                },
                {
                  name: 'Page-Click'
                },
                {
                  name: 'Detail-Favourite'
                },
                {
                  name: 'Lost'
                }
              ]
            }}
          >
            <Tooltip />
          </Sankey>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}