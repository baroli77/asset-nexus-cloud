
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockUtilizationData = [
  { month: 'Jan', active: 85, idle: 15 },
  { month: 'Feb', active: 78, idle: 22 },
  { month: 'Mar', active: 92, idle: 8 },
  { month: 'Apr', active: 88, idle: 12 },
  { month: 'May', active: 95, idle: 5 },
  { month: 'Jun', active: 90, idle: 10 },
];

export const UtilizationReport = () => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Asset Utilization Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer 
              className="w-full h-full"
              config={{ 
                active: { color: "#4361ee" }, 
                idle: { color: "#f72585" }
              }}
            >
              <LineChart data={mockUtilizationData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone"
                  dataKey="active"
                  name="Active Use"
                  stroke="#4361ee"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone"
                  dataKey="idle"
                  name="Idle Time"
                  stroke="#f72585"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
