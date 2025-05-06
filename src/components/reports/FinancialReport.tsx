
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockFinancialData = [
  { month: 'Jan', value: 25000, maintenance: 2000 },
  { month: 'Feb', value: 28000, maintenance: 1500 },
  { month: 'Mar', value: 32000, maintenance: 3000 },
  { month: 'Apr', value: 35000, maintenance: 2500 },
  { month: 'May', value: 40000, maintenance: 1800 },
  { month: 'Jun', value: 45000, maintenance: 2200 },
];

export const FinancialReport = () => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Asset Value & Maintenance Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer 
              className="w-full h-full"
              config={{ 
                value: { color: "#4361ee" }, 
                maintenance: { color: "#f72585" }
              }}
            >
              <AreaChart data={mockFinancialData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Asset Value"
                  stroke="#4361ee"
                  fill="#4361ee"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="maintenance"
                  name="Maintenance Cost"
                  stroke="#f72585"
                  fill="#f72585"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
