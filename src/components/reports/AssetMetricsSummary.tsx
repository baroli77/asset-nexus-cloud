
import { useQuery } from "@tanstack/react-query";
import { getAssetMetrics } from "@/services/reportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartColumnBig, Package, DollarSign, ChartBarBig } from "lucide-react";

export const AssetMetricsSummary = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['asset-metrics'],
    queryFn: getAssetMetrics
  });

  if (isLoading || !metrics) {
    return <div className="animate-pulse grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-[120px] bg-muted rounded-lg" />
      ))}
    </div>;
  }

  const items = [
    {
      title: "Total Assets",
      value: metrics.totalAssets,
      icon: Package
    },
    {
      title: "Categories",
      value: Object.keys(metrics.byCategory).length,
      icon: ChartColumnBig
    },
    {
      title: "Status Types",
      value: Object.keys(metrics.byStatus).length,
      icon: ChartBarBig
    },
    {
      title: "Total Value",
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(metrics.totalValue),
      icon: DollarSign
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
