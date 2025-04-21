
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockMaintenanceData = [
  { month: 'Jan', scheduled: 4, emergency: 1 },
  { month: 'Feb', scheduled: 3, emergency: 2 },
  { month: 'Mar', scheduled: 5, emergency: 0 },
  { month: 'Apr', scheduled: 2, emergency: 3 },
  { month: 'May', scheduled: 6, emergency: 1 },
  { month: 'Jun', scheduled: 4, emergency: 2 },
];

export const MaintenanceReport = () => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <BarChart data={mockMaintenanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scheduled" name="Scheduled" fill="#4361ee" />
                <Bar dataKey="emergency" name="Emergency" fill="#f72585" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
