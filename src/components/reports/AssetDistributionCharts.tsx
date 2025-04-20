
import { useQuery } from "@tanstack/react-query";
import { getAssetMetrics } from "@/services/reportService";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#6366F1'];

export const AssetDistributionCharts = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['asset-metrics'],
    queryFn: getAssetMetrics
  });

  if (isLoading || !metrics) {
    return <div className="animate-pulse space-y-4">
      <div className="h-[300px] bg-muted rounded-lg" />
      <div className="h-[300px] bg-muted rounded-lg" />
    </div>;
  }

  const categoryData = Object.entries(metrics.byCategory).map(([name, value]) => ({
    name,
    value
  }));

  const statusData = Object.entries(metrics.byStatus).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Assets by Category</CardTitle>
          <CardDescription>Distribution of assets across different categories</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={{}}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#8B5CF6" />
              <ChartTooltip />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Current status of all assets</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={{}}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.name}
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
