
import { MainLayout } from "@/components/layout/MainLayout";
import { FileBarChart } from "lucide-react";
import { AssetMetricsSummary } from "@/components/reports/AssetMetricsSummary";
import { AssetDistributionCharts } from "@/components/reports/AssetDistributionCharts";

const Reports = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              View detailed analytics and reports about your assets
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileBarChart className="h-6 w-6 text-primary" />
          </div>
        </div>

        <AssetMetricsSummary />
        <AssetDistributionCharts />
      </div>
    </MainLayout>
  );
};

export default Reports;
